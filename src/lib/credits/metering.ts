import { db } from "@/db";
import { creditBalances, creditTransactions, usageEvents, servicePricing } from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
// import { polarClient } from "@/lib/polar"; // TODO: Uncomment when Polar events API is available
import Decimal from "decimal.js";

type DecimalValue = InstanceType<typeof Decimal>;

// Service types with their units
export const SERVICE_UNITS = {
  openai_gpt4o: "tokens",
  openai_gpt4o_mini: "tokens",
  stream_video_call: "minutes",
  stream_chat_message: "messages",
  stream_transcription: "minutes",
} as const;

// Default pricing configuration (dynamically updated from servicePricing table)
export const DEFAULT_SERVICE_PRICING = {
  openai_gpt4o: { 
    inputPricePerMillion: 2.50, // $2.50 per 1M input tokens
    outputPricePerMillion: 10.00, // $10.00 per 1M output tokens
  },
  openai_gpt4o_mini: { 
    inputPricePerMillion: 0.15, // $0.15 per 1M input tokens
    outputPricePerMillion: 0.60, // $0.60 per 1M output tokens
  },
  stream_video_call: { pricePerMinute: 0.004 }, // $0.004 per minute
  stream_chat_message: { pricePerMessage: 0.0002 }, // $0.0002 per message
  stream_transcription: { pricePerMinute: 0.006 }, // $0.006 per minute
} as const;

// Credit conversion: 1 credit = $0.001 (1/10th of a cent)
// With 20% profit margin: User pays $1 for 800 credits (80% of $1 = $0.80 worth of services)
export const CREDIT_TO_USD_RATE = 0.001;
export const DEFAULT_PROFIT_MARGIN = 0.20;

export class CreditMeteringService {
  /**
   * Initialize credit balance for a new user
   */
  static async initializeUserCredits(userId: string) {
    const existing = await db
      .select()
      .from(creditBalances)
      .where(eq(creditBalances.userId, userId))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(creditBalances).values({
        userId,
        availableCredits: "0",
        totalPurchased: "0",
        totalUsed: "0",
      });
    }
  }

  /**
   * Get user's current credit balance
   */
  static async getUserBalance(userId: string) {
    const [balance] = await db
      .select()
      .from(creditBalances)
      .where(eq(creditBalances.userId, userId))
      .limit(1);

    if (!balance) {
      await this.initializeUserCredits(userId);
      return {
        availableCredits: new Decimal(0),
        totalPurchased: new Decimal(0),
        totalUsed: new Decimal(0),
      };
    }

    return {
      availableCredits: new Decimal(balance.availableCredits),
      totalPurchased: new Decimal(balance.totalPurchased),
      totalUsed: new Decimal(balance.totalUsed),
    };
  }

  /**
   * Calculate credit cost for a service usage
   */
  static async calculateCreditCost(
    service: keyof typeof SERVICE_UNITS,
    quantity: number,
    metadata?: {
      inputTokens?: number;
      outputTokens?: number;
    }
  ): Promise<DecimalValue> {
    // Get current pricing from database
    const result = await db
      .select()
      .from(servicePricing)
      .where(and(eq(servicePricing.service, service), eq(servicePricing.isActive, true)))
      .limit(1);
    const pricing = result[0];

    let costInUSD = new Decimal(0);

    if (service === "openai_gpt4o" || service === "openai_gpt4o_mini") {
      const defaultPricing = DEFAULT_SERVICE_PRICING[service];
      const inputTokens = metadata?.inputTokens || 0;
      const outputTokens = metadata?.outputTokens || 0;
      
      costInUSD = new Decimal(inputTokens)
        .div(1_000_000)
        .times(defaultPricing.inputPricePerMillion)
        .plus(
          new Decimal(outputTokens)
            .div(1_000_000)
            .times(defaultPricing.outputPricePerMillion)
        );
    } else {
      // Handle other service types with proper type safety
      switch (service) {
        case "stream_video_call":
          costInUSD = new Decimal(quantity).times(DEFAULT_SERVICE_PRICING.stream_video_call.pricePerMinute);
          break;
        case "stream_chat_message":
          costInUSD = new Decimal(quantity).times(DEFAULT_SERVICE_PRICING.stream_chat_message.pricePerMessage);
          break;
        case "stream_transcription":
          costInUSD = new Decimal(quantity).times(DEFAULT_SERVICE_PRICING.stream_transcription.pricePerMinute);
          break;
        default:
          costInUSD = new Decimal(0);
      }
    }

    // Apply profit margin and convert to credits
    const profitMargin = pricing?.profitMargin ? new Decimal(pricing.profitMargin) : new Decimal(DEFAULT_PROFIT_MARGIN);
    const creditConversionRate = pricing?.creditConversionRate 
      ? new Decimal(pricing.creditConversionRate)
      : new Decimal(1).div(CREDIT_TO_USD_RATE).times(new Decimal(1).minus(profitMargin));

    return costInUSD.times(creditConversionRate);
  }

  /**
   * Track usage event and deduct credits
   */
  static async trackUsage(params: {
    userId: string;
    service: keyof typeof SERVICE_UNITS;
    quantity: number;
    resourceId?: string;
    resourceType?: string;
    metadata?: Record<string, string | number | boolean | null | undefined>;
  }) {
    const { userId, service, quantity, resourceId, resourceType, metadata } = params;

    // Calculate credit cost
    const creditCost = await this.calculateCreditCost(service, quantity, metadata);

    // Get current balance
    const balance = await this.getUserBalance(userId);

    // Check if user has enough credits
    if (balance.availableCredits.lessThan(creditCost)) {
      throw new Error("Insufficient credits");
    }

    // Update balance FIRST (most critical operation)
    const newAvailableCredits = balance.availableCredits.minus(creditCost);
    const newTotalUsed = balance.totalUsed.plus(creditCost);

    try {
      await db
        .update(creditBalances)
        .set({
          availableCredits: newAvailableCredits.toFixed(6),
          totalUsed: newTotalUsed.toFixed(6),
          updatedAt: new Date(),
        })
        .where(eq(creditBalances.userId, userId));
    } catch (error) {
      // If balance update fails, don't create usage event
      throw new Error(`Failed to update balance: ${error}`);
    }

    // Create usage event AFTER balance is updated
    const [usageEvent] = await db
      .insert(usageEvents)
      .values({
        userId,
        service,
        quantity: quantity.toString(),
        unitCost: (quantity > 0 ? creditCost.div(quantity) : creditCost).toFixed(6),
        totalCost: creditCost.toFixed(6),
        resourceId,
        resourceType,
        metadata: metadata ? JSON.stringify(metadata) : null,
      })
      .returning();

    // Create transaction record (least critical - can fail without major issues)
    await db.insert(creditTransactions).values({
      userId,
      type: "usage",
      amount: creditCost.neg().toFixed(6), // Negative for usage
      balanceBefore: balance.availableCredits.toFixed(6),
      balanceAfter: newAvailableCredits.toFixed(6),
      description: `${service} usage: ${quantity} ${SERVICE_UNITS[service]}`,
      metadata: JSON.stringify({
        usageEventId: usageEvent.id,
        service,
        quantity,
        resourceId,
        resourceType,
      }),
    });



    return usageEvent;
  }

  /**
   * Add credits to user balance (from purchase)
   */
  static async addCredits(params: {
    userId: string;
    credits: number;
    polarCheckoutId?: string;
    polarTransactionId?: string;
    description?: string;
  }) {
    const { userId, credits, polarCheckoutId, polarTransactionId, description } = params;

    const creditsDecimal = new Decimal(credits);
    const balance = await this.getUserBalance(userId);

    const newAvailableCredits = balance.availableCredits.plus(creditsDecimal);
    const newTotalPurchased = balance.totalPurchased.plus(creditsDecimal);

    // Update balance
    await db
      .update(creditBalances)
      .set({
        availableCredits: newAvailableCredits.toFixed(6),
        totalPurchased: newTotalPurchased.toFixed(6),
        updatedAt: new Date(),
      })
      .where(eq(creditBalances.userId, userId));

    // Create transaction record
    await db.insert(creditTransactions).values({
      userId,
      type: "purchase",
      amount: creditsDecimal.toFixed(6),
      balanceBefore: balance.availableCredits.toFixed(6),
      balanceAfter: newAvailableCredits.toFixed(6),
      description: description || "Credit purchase",
      polarCheckoutId,
      polarTransactionId,
      metadata: JSON.stringify({
        polarCheckoutId,
        polarTransactionId,
      }),
    });

    return newAvailableCredits;
  }

  // Note: reservation logic removed; credits are charged directly on usage

  /**
   * Get usage history for a user
   */
  static async getUserUsageHistory(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      service?: keyof typeof SERVICE_UNITS;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const query = db
      .select()
      .from(usageEvents)
      .where(
        and(
          eq(usageEvents.userId, userId),
          options?.service ? eq(usageEvents.service, options.service) : undefined,
          options?.startDate ? sql`${usageEvents.createdAt} >= ${options.startDate}` : undefined,
          options?.endDate ? sql`${usageEvents.createdAt} <= ${options.endDate}` : undefined
        )
      )
      .orderBy(desc(usageEvents.createdAt))
      .limit(options?.limit || 50)
      .offset(options?.offset || 0);

    return await query;
  }

  /**
   * Get transaction history for a user
   */
  static async getUserTransactionHistory(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      type?: "purchase" | "usage" | "refund" | "adjustment" | "expiration";
    }
  ) {
    const query = db
      .select()
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.userId, userId),
          options?.type ? eq(creditTransactions.type, options.type) : undefined
        )
      )
      .orderBy(desc(creditTransactions.createdAt))
      .limit(options?.limit || 50)
      .offset(options?.offset || 0);

    return await query;
  }

  /**
   * Estimate credit cost for OpenAI completion
   */
  static async estimateOpenAICost(
    model: "gpt-4o" | "gpt-4o-mini",
    estimatedInputTokens: number,
    estimatedOutputTokens: number
  ): Promise<{ credits: number; usd: number }> {
    const service = model === "gpt-4o" ? "openai_gpt4o" : "openai_gpt4o_mini";
    const credits = await this.calculateCreditCost(service, 1, {
      inputTokens: estimatedInputTokens,
      outputTokens: estimatedOutputTokens,
    });

    return {
      credits: credits.toNumber(),
      usd: credits.times(CREDIT_TO_USD_RATE).toNumber(),
    };
  }

  /**
   * Estimate credit cost for Stream.io services
   */
  static async estimateStreamCost(
    service: "video_call" | "chat_message" | "transcription",
    quantity: number
  ): Promise<{ credits: number; usd: number }> {
    const serviceMap = {
      video_call: "stream_video_call",
      chat_message: "stream_chat_message",
      transcription: "stream_transcription",
    } as const;

    const key = serviceMap[service];
    const credits = await this.calculateCreditCost(key, quantity);

    return {
      credits: credits.toNumber(),
      usd: credits.times(CREDIT_TO_USD_RATE).toNumber(),
    };
  }
}
