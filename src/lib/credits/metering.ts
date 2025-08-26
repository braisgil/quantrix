import { db } from "@/db";
import { creditBalances, creditTransactions, usageEvents, servicePricing } from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
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
  private static DEFAULT_FREE_ALLOCATION = new Decimal(500);

  private static computeNextMonthlyRenewal(from: Date): Date {
    const d = new Date(from);
    return new Date(
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
      d.getMilliseconds()
    );
  }

  private static computeNextAfter(now: Date, base: Date): Date {
    let next = new Date(base);
    // Ensure next is strictly in the future relative to now
    while (next <= now) {
      next = this.computeNextMonthlyRenewal(next);
    }
    return next;
  }

  private static toDecimal(value: string | number | null | undefined): DecimalValue {
    try {
      if (value === null || value === undefined) return new Decimal(0);
      return new Decimal(value);
    } catch {
      return new Decimal(0);
    }
  }

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
      const now = new Date();
      await db.insert(creditBalances).values({
        userId,
        // Treat availableCredits as paid credits bucket
        availableCredits: "0",
        totalPurchased: "0",
        totalUsed: "0",
        freeCreditsAvailable: CreditMeteringService.DEFAULT_FREE_ALLOCATION.toFixed(6),
        freeCreditsAllocation: CreditMeteringService.DEFAULT_FREE_ALLOCATION.toFixed(6),
        nextFreeRenewalAt: CreditMeteringService.computeNextMonthlyRenewal(now),
        totalFreeUsed: "0",
      });
    }
  }

  /**
   * Get user's current credit balance
   */
  static async getUserBalance(userId: string): Promise<{
    availableCredits: DecimalValue;
    totalPurchased: DecimalValue;
    totalUsed: DecimalValue;
    freeAvailable: DecimalValue;
    freeAllocation: DecimalValue;
    nextFreeRenewalAt: Date | undefined;
    paidAvailable: DecimalValue;
  }> {
    // Ensure record exists
    await this.initializeUserCredits(userId);

    const [balance] = await db
      .select()
      .from(creditBalances)
      .where(eq(creditBalances.userId, userId))
      .limit(1);

    if (!balance) {
      return {
        availableCredits: new Decimal(0),
        totalPurchased: new Decimal(0),
        totalUsed: new Decimal(0),
        freeAvailable: new Decimal(0),
        freeAllocation: this.DEFAULT_FREE_ALLOCATION,
        nextFreeRenewalAt: undefined,
        paidAvailable: new Decimal(0),
      };
    }

    type CreditBalanceRow = InferSelectModel<typeof creditBalances>;
    const row = balance as CreditBalanceRow;
    const paidAvailable = this.toDecimal(row.availableCredits);
    const freeAvailable = this.toDecimal(row.freeCreditsAvailable ?? "0");
    const allocStr = row.freeCreditsAllocation && row.freeCreditsAllocation !== ''
      ? row.freeCreditsAllocation
      : CreditMeteringService.DEFAULT_FREE_ALLOCATION.toFixed(6);
    const freeAllocation = this.toDecimal(allocStr);

    return {
      // Expose total available to external callers for gating/UI
      availableCredits: paidAvailable.plus(freeAvailable),
      totalPurchased: this.toDecimal(row.totalPurchased),
      totalUsed: this.toDecimal(row.totalUsed),
      freeAvailable,
      freeAllocation,
      nextFreeRenewalAt: row.nextFreeRenewalAt || undefined,
      paidAvailable,
    };
  }

  /** Ensure free credits are reset to allocation if renewal date has passed */
  static async ensureFreeCreditsRenewal(userId: string) {
    const [balance] = await db
      .select()
      .from(creditBalances)
      .where(eq(creditBalances.userId, userId))
      .limit(1);

    if (!balance) return;

    const now = new Date();
    type CreditBalanceRow = InferSelectModel<typeof creditBalances>;
    const row = balance as CreditBalanceRow;
    const nextAt = row.nextFreeRenewalAt as Date | null;
    const allocationStr = row.freeCreditsAllocation && row.freeCreditsAllocation !== ''
      ? row.freeCreditsAllocation
      : CreditMeteringService.DEFAULT_FREE_ALLOCATION.toFixed(6);
    const allocation = this.toDecimal(allocationStr);
    
    if (!nextAt || now >= nextAt) {
      const base = nextAt ? new Date(nextAt) : new Date(row.createdAt || now);
      const newNext = this.computeNextAfter(now, base);
      // Reset free credits to allocation regardless of current value
      await db
        .update(creditBalances)
        .set({
          freeCreditsAvailable: allocation.toFixed(6),
          nextFreeRenewalAt: newNext,
          updatedAt: now,
        })
        .where(eq(creditBalances.userId, userId));
    }
  }

  /**
   * Get the next free credits renewal date. Ensures renewal state is up-to-date.
   */
  static async getNextFreeRenewalDate(userId: string): Promise<Date | undefined> {
    await this.ensureFreeCreditsRenewal(userId);
    const [row] = await db
      .select()
      .from(creditBalances)
      .where(eq(creditBalances.userId, userId))
      .limit(1);
    if (!row) return undefined;
    return row.nextFreeRenewalAt || undefined;
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

    // Ensure free renewal first (so we deduct accurately from free bucket)
    await this.ensureFreeCreditsRenewal(userId);

    // Single-statement atomic deduction using SQL arithmetic on current row
    const costNum = new Decimal(creditCost).toFixed(6);
    const updated = await db.execute(sql`
      WITH vars AS (SELECT CAST(${costNum} AS NUMERIC) AS cost),
      pre AS (
        SELECT user_id, CAST(free_credits_available AS NUMERIC) AS free_avail,
               CAST(available_credits AS NUMERIC) AS paid_avail
        FROM credit_balances WHERE user_id = ${userId}
      ),
      upd AS (
        UPDATE credit_balances b
        SET
          free_credits_available = (CAST(b.free_credits_available AS NUMERIC) - LEAST(pre.free_avail, vars.cost))::TEXT,
          available_credits = (CAST(b.available_credits AS NUMERIC) - GREATEST(vars.cost - LEAST(pre.free_avail, vars.cost), 0))::TEXT,
          total_used = (CAST(b.total_used AS NUMERIC) + vars.cost)::TEXT,
          total_free_used = (CAST(b.total_free_used AS NUMERIC) + LEAST(pre.free_avail, vars.cost))::TEXT,
          updated_at = NOW()
        FROM pre, vars
        WHERE b.user_id = pre.user_id AND b.user_id = ${userId}
          AND (pre.free_avail + pre.paid_avail) >= vars.cost
        RETURNING
          b.user_id,
          pre.free_avail,
          pre.paid_avail,
          vars.cost,
          LEAST(pre.free_avail, vars.cost) AS deducted_free,
          GREATEST(vars.cost - LEAST(pre.free_avail, vars.cost), 0) AS deducted_paid
      )
      SELECT * FROM upd;
    `);

    type UpdRowItem = {
      user_id: string;
      free_avail: string | number | null;
      paid_avail: string | number | null;
      cost: string | number | null;
      deducted_free: string | number | null;
      deducted_paid: string | number | null;
    };
    type UpdRowsContainer = { rows?: UpdRowItem[] } | UpdRowItem[] | undefined;
    const container = updated as unknown as UpdRowsContainer;
    const rows: UpdRowItem[] = Array.isArray(container)
      ? container
      : (container && Object.prototype.hasOwnProperty.call(container as object, 'rows'))
        ? ((container as { rows?: UpdRowItem[] }).rows || [])
        : [];
    if (!rows || rows.length === 0) {
      // Not enough credits or user not found
      throw new Error("Insufficient credits");
    }

    const row = rows[0];
    const costFromFree = new Decimal(row.deducted_free ?? 0);
    const costFromPaid = new Decimal(row.deducted_paid ?? 0);
    const beforeTotal = new Decimal(row.free_avail ?? 0).plus(new Decimal(row.paid_avail ?? 0));

    // Write usage event and transactions
    const events = await db
      .insert(usageEvents)
      .values({
        userId,
        service,
        quantity: quantity.toString(),
        unitCost: (quantity > 0 ? creditCost.div(quantity) : creditCost).toFixed(6),
        totalCost: creditCost.toFixed(6),
        resourceId,
        resourceType,
        metadata: JSON.stringify({
          ...(metadata || {}),
          costFromFree: costFromFree.toFixed(6),
          costFromPaid: costFromPaid.toFixed(6),
        }),
      })
      .returning();
    const usageEventId = events[0]?.id;

    if (costFromFree.greaterThan(0)) {
      await db.insert(creditTransactions).values({
        userId,
        type: "usage",
        amount: costFromFree.neg().toFixed(6),
        balanceBefore: beforeTotal.toFixed(6),
        balanceAfter: beforeTotal.minus(costFromFree).toFixed(6),
        description: `${service} usage (free): ${quantity} ${SERVICE_UNITS[service]}`,
        metadata: JSON.stringify({
          usageEventId,
          source: "free",
          service,
          quantity,
          resourceId,
          resourceType,
        }),
      });
    }

    if (costFromPaid.greaterThan(0)) {
      const beforePaid = beforeTotal.minus(costFromFree);
      await db.insert(creditTransactions).values({
        userId,
        type: "usage",
        amount: costFromPaid.neg().toFixed(6),
        balanceBefore: beforePaid.toFixed(6),
        balanceAfter: beforePaid.minus(costFromPaid).toFixed(6),
        description: `${service} usage (paid): ${quantity} ${SERVICE_UNITS[service]}`,
        metadata: JSON.stringify({
          usageEventId,
          source: "paid",
          service,
          quantity,
          resourceId,
          resourceType,
        }),
      });
    }

    return events[0];
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
    // Ensure free renewal does not interfere with purchase
    await this.ensureFreeCreditsRenewal(userId);

    const current = await this.getUserBalance(userId);

    const newPaidAvailable = (current.paidAvailable || new Decimal(0)).plus(creditsDecimal);
    const newTotalPurchased = current.totalPurchased.plus(creditsDecimal);

    // Update balance
    await db
      .update(creditBalances)
      .set({
        availableCredits: newPaidAvailable.toFixed(6),
        totalPurchased: newTotalPurchased.toFixed(6),
        updatedAt: new Date(),
      })
      .where(eq(creditBalances.userId, userId));

    // Create transaction record
    const balanceBeforeTotal = current.availableCredits;
    const balanceAfterTotal = balanceBeforeTotal.plus(creditsDecimal);

    await db.insert(creditTransactions).values({
      userId,
      type: "purchase",
      amount: creditsDecimal.toFixed(6),
      balanceBefore: balanceBeforeTotal.toFixed(6),
      balanceAfter: balanceAfterTotal.toFixed(6),
      description: description || "Credit purchase",
      polarCheckoutId,
      polarTransactionId,
      metadata: JSON.stringify({
        polarCheckoutId,
        polarTransactionId,
      }),
    });

    return newPaidAvailable;
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
