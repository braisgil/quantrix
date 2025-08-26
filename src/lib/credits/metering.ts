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
  stream_video_call: "participant_minutes",
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
  stream_video_call: { pricePerParticipantMinute: 0.0004 }, // $0.0004 per participant minute (GetStream.io: $0.0003)
  stream_chat_message: { pricePerMessage: 0.001 }, // $0.001 per message (covers GetStream.io MAU costs)
  stream_transcription: { pricePerMinute: 0.009 }, // $0.009 per minute (GetStream.io cost + buffer)
} as const;

// Credit conversion: 1 credit = $0.001 (1/10th of a cent)
// With 20% profit margin: User pays $1 for 800 credits (80% of $1 = $0.80 worth of services)
export const CREDIT_TO_USD_RATE = 0.001;
export const DEFAULT_PROFIT_MARGIN = 0.20;

export class CreditMeteringService {
  /**
   * Initialize credit balance for a new user with 500 free credits
   */
  static async initializeUserCredits(userId: string) {
    const existing = await db
      .select()
      .from(creditBalances)
      .where(eq(creditBalances.userId, userId))
      .limit(1);

    if (existing.length === 0) {
      const now = new Date();
      const nextAllocation = new Date(now);
      // Set next allocation to same day next month (Aug 26 → Sept 26)
      nextAllocation.setMonth(nextAllocation.getMonth() + 1);

      await db.insert(creditBalances).values({
        userId,
        availableCredits: "0",
        totalPurchased: "0",
        totalUsed: "0",
        freeCreditAllocation: "500",
        availableFreeCredits: "500",
        totalFreeCreditsGranted: "500",
        totalFreeCreditsUsed: "0",
        lastFreeAllocationDate: now,
        nextFreeAllocationDate: nextAllocation,
      });

      // Create initial free credit transaction
      await db.insert(creditTransactions).values({
        userId,
        type: "free_allocation",
        amount: "500",
        balanceBefore: "0",
        balanceAfter: "500",
        description: "Initial free credits allocation",
        metadata: JSON.stringify({
          type: "initial_registration",
          allocation: 500,
        }),
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
      const now = new Date();
      const nextAllocation = new Date(now);
      // Set next allocation to same day next month (Aug 26 → Sept 26)
      nextAllocation.setMonth(nextAllocation.getMonth() + 1);
      
      return {
        availableCredits: new Decimal(0),
        totalPurchased: new Decimal(0),
        totalUsed: new Decimal(0),
        availableFreeCredits: new Decimal(500), // Initial free credits
        totalFreeCreditsGranted: new Decimal(500),
        totalFreeCreditsUsed: new Decimal(0),
        freeCreditAllocation: new Decimal(500),
        lastFreeAllocationDate: now,
        nextFreeAllocationDate: nextAllocation,
      };
    }

    // Check if user needs free credit replenishment
    await this.checkAndReplenishFreeCredits(userId, balance);

    // Refetch balance after potential replenishment
    const [updatedBalance] = balance.nextFreeAllocationDate && new Date() >= new Date(balance.nextFreeAllocationDate)
      ? await db.select().from(creditBalances).where(eq(creditBalances.userId, userId)).limit(1)
      : [balance];

    return {
      availableCredits: new Decimal(updatedBalance.availableCredits),
      totalPurchased: new Decimal(updatedBalance.totalPurchased),
      totalUsed: new Decimal(updatedBalance.totalUsed),
      availableFreeCredits: new Decimal(updatedBalance.availableFreeCredits),
      totalFreeCreditsGranted: new Decimal(updatedBalance.totalFreeCreditsGranted),
      totalFreeCreditsUsed: new Decimal(updatedBalance.totalFreeCreditsUsed),
      freeCreditAllocation: new Decimal(updatedBalance.freeCreditAllocation),
      lastFreeAllocationDate: updatedBalance.lastFreeAllocationDate,
      nextFreeAllocationDate: updatedBalance.nextFreeAllocationDate,
    };
  }

  /**
   * Check and replenish free credits if due date has passed
   * 
   * Note: This is called automatically by getUserBalance() for on-demand replenishment.
   * This approach is more reliable than cron jobs since it happens exactly when needed
   * and doesn't require separate infrastructure.
   */
  static async checkAndReplenishFreeCredits(userId: string, balance?: typeof creditBalances.$inferSelect) {
    const currentBalance = balance || (await db
      .select()
      .from(creditBalances)
      .where(eq(creditBalances.userId, userId))
      .limit(1))[0];

    if (!currentBalance?.nextFreeAllocationDate) return;

    const now = new Date();
    const nextAllocationDate = new Date(currentBalance.nextFreeAllocationDate);

    if (now >= nextAllocationDate) {
      const allocation = new Decimal(currentBalance.freeCreditAllocation);
      const newTotalGranted = new Decimal(currentBalance.totalFreeCreditsGranted).plus(allocation);
      const nextMonth = new Date(nextAllocationDate);
      // Set next replenishment to same day next month (Sept 26 → Oct 26)
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      // Replenish free credits to full allocation
      await db
        .update(creditBalances)
        .set({
          availableFreeCredits: allocation.toFixed(6),
          totalFreeCreditsGranted: newTotalGranted.toFixed(6),
          lastFreeAllocationDate: now,
          nextFreeAllocationDate: nextMonth,
          updatedAt: now,
        })
        .where(eq(creditBalances.userId, userId));

      // Create replenishment transaction
      await db.insert(creditTransactions).values({
        userId,
        type: "free_allocation",
        amount: allocation.toFixed(6),
        balanceBefore: currentBalance.availableFreeCredits,
        balanceAfter: allocation.toFixed(6),
        description: "Monthly free credits replenishment",
        metadata: JSON.stringify({
          type: "monthly_replenishment",
          allocation: allocation.toNumber(),
          previousAllocation: currentBalance.lastFreeAllocationDate,
        }),
      });
    }
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
          costInUSD = new Decimal(quantity).times(DEFAULT_SERVICE_PRICING.stream_video_call.pricePerParticipantMinute);
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
   * Track usage event and deduct credits (prioritizes free credits first)
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

    // Check if user has enough credits (free + paid)
    const totalAvailable = balance.availableFreeCredits.plus(balance.availableCredits);
    if (totalAvailable.lessThan(creditCost)) {
      throw new Error("Insufficient credits");
    }

    // Determine how to split the cost between free and paid credits
    let freeCreditsUsed = new Decimal(0);
    let paidCreditsUsed = new Decimal(0);

    if (balance.availableFreeCredits.greaterThanOrEqualTo(creditCost)) {
      // Use only free credits
      freeCreditsUsed = creditCost;
    } else {
      // Use all available free credits, then paid credits
      freeCreditsUsed = balance.availableFreeCredits;
      paidCreditsUsed = creditCost.minus(freeCreditsUsed);
    }

    // Calculate new balances
    const newAvailableFreeCredits = balance.availableFreeCredits.minus(freeCreditsUsed);
    const newAvailableCredits = balance.availableCredits.minus(paidCreditsUsed);
    const newTotalUsed = balance.totalUsed.plus(paidCreditsUsed);
    const newTotalFreeCreditsUsed = balance.totalFreeCreditsUsed.plus(freeCreditsUsed);

    try {
      // Update balance FIRST (most critical operation)
      await db
        .update(creditBalances)
        .set({
          availableCredits: newAvailableCredits.toFixed(6),
          availableFreeCredits: newAvailableFreeCredits.toFixed(6),
          totalUsed: newTotalUsed.toFixed(6),
          totalFreeCreditsUsed: newTotalFreeCreditsUsed.toFixed(6),
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

    // Create transaction records for free credits if used
    if (freeCreditsUsed.greaterThan(0)) {
      await db.insert(creditTransactions).values({
        userId,
        type: "free_usage",
        amount: freeCreditsUsed.neg().toFixed(6), // Negative for usage
        balanceBefore: balance.availableFreeCredits.toFixed(6),
        balanceAfter: newAvailableFreeCredits.toFixed(6),
        description: `${service} usage: ${quantity} ${SERVICE_UNITS[service]} (free credits)`,
        metadata: JSON.stringify({
          usageEventId: usageEvent.id,
          service,
          quantity,
          resourceId,
          resourceType,
          creditType: "free",
          freeCreditsUsed: freeCreditsUsed.toNumber(),
        }),
      });
    }

    // Create transaction records for paid credits if used
    if (paidCreditsUsed.greaterThan(0)) {
      await db.insert(creditTransactions).values({
        userId,
        type: "usage",
        amount: paidCreditsUsed.neg().toFixed(6), // Negative for usage
        balanceBefore: balance.availableCredits.toFixed(6),
        balanceAfter: newAvailableCredits.toFixed(6),
        description: `${service} usage: ${quantity} ${SERVICE_UNITS[service]} (paid credits)`,
        metadata: JSON.stringify({
          usageEventId: usageEvent.id,
          service,
          quantity,
          resourceId,
          resourceType,
          creditType: "paid",
          paidCreditsUsed: paidCreditsUsed.toNumber(),
        }),
      });
    }

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

  /**
   * Grant free credits to user (for admin use or special promotions)
   */
  static async grantFreeCredits(params: {
    userId: string;
    credits: number;
    description?: string;
    type?: "promotion" | "adjustment" | "bonus" | "compensation";
  }) {
    const { userId, credits, description, type = "adjustment" } = params;

    const creditsDecimal = new Decimal(credits);
    const balance = await this.getUserBalance(userId);

    const newAvailableFreeCredits = balance.availableFreeCredits.plus(creditsDecimal);
    const newTotalGranted = balance.totalFreeCreditsGranted.plus(creditsDecimal);

    // Update balance
    await db
      .update(creditBalances)
      .set({
        availableFreeCredits: newAvailableFreeCredits.toFixed(6),
        totalFreeCreditsGranted: newTotalGranted.toFixed(6),
        updatedAt: new Date(),
      })
      .where(eq(creditBalances.userId, userId));

    // Create transaction record
    await db.insert(creditTransactions).values({
      userId,
      type: "free_allocation",
      amount: creditsDecimal.toFixed(6),
      balanceBefore: balance.availableFreeCredits.toFixed(6),
      balanceAfter: newAvailableFreeCredits.toFixed(6),
      description: description || `Free credits granted (${type})`,
      metadata: JSON.stringify({
        type,
        grantedAmount: credits,
      }),
    });

    return newAvailableFreeCredits;
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
