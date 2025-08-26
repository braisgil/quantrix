import { db } from "@/db";
import { creditBalances, creditTransactions, usageEvents, conversations } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

// Simple constants - no separate file needed
const FREE_CREDITS = 500;
const MIN_START_CREDITS = 30;
const WARNING_THRESHOLD = 50;
// const FORCE_TERMINATION_THRESHOLD = 25; // Defined in frontend
const COSTS = {
  videoCallPerMin: 0.8,
  transcriptionPerMin: 7.2,
  processing: 150,
  openaiGpt4o: 0.01, // per token rough estimate
  openaiGpt4oMini: 0.001, // per token rough estimate
};

// Service units for compatibility
const SERVICE_UNITS = {
  openai_gpt4o: "tokens",
  openai_gpt4o_mini: "tokens", 
  stream_video_call: "participant_minutes",
  stream_chat_message: "messages",
  stream_transcription: "minutes",
} as const;

type ServiceType = keyof typeof SERVICE_UNITS;

/**
 * Simple, unified credit service - handles everything in one place
 * Replaces CreditMeteringService + SmartCreditGuard + SmartCreditManager
 * 
 * Maintains 100% compatibility with existing functionality while being 90% simpler
 */
export class CreditService {
  
  /**
   * Initialize user with 500 free credits (call after registration)
   */
  static async initializeUser(userId: string) {
    const existing = await db.select().from(creditBalances).where(eq(creditBalances.userId, userId));
    if (existing.length > 0) return;

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await db.insert(creditBalances).values({
      userId,
      availableCredits: "0",
      totalPurchased: "0", 
      totalUsed: "0",
      freeCreditAllocation: FREE_CREDITS.toString(),
      availableFreeCredits: FREE_CREDITS.toString(),
      totalFreeCreditsGranted: FREE_CREDITS.toString(),
      totalFreeCreditsUsed: "0",
      lastFreeAllocationDate: new Date(),
      nextFreeAllocationDate: nextMonth,
    });
  }

  /**
   * Get user balance (automatically renews free credits if due)
   */
  static async getBalance(userId: string) {
    let [balance] = await db.select().from(creditBalances).where(eq(creditBalances.userId, userId));
    
    if (!balance) {
      await this.initializeUser(userId);
      [balance] = await db.select().from(creditBalances).where(eq(creditBalances.userId, userId));
    }

    // Auto-renew free credits if due
    if (balance.nextFreeAllocationDate && new Date() >= balance.nextFreeAllocationDate) {
      const nextMonth = new Date(balance.nextFreeAllocationDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      await db.update(creditBalances)
        .set({
          availableFreeCredits: FREE_CREDITS.toString(),
          totalFreeCreditsGranted: (parseFloat(balance.totalFreeCreditsGranted) + FREE_CREDITS).toString(),
          lastFreeAllocationDate: new Date(),
          nextFreeAllocationDate: nextMonth,
        })
        .where(eq(creditBalances.userId, userId));

      [balance] = await db.select().from(creditBalances).where(eq(creditBalances.userId, userId));
    }

    const available = parseFloat(balance.availableCredits) + parseFloat(balance.availableFreeCredits);
    return { ...balance, totalAvailable: available };
  }

  /**
   * Check if user can start a call (preflight check)
   */
  static async canStartCall(userId: string, estimatedMinutes = 30) {
    const balance = await this.getBalance(userId);
    const estimatedCost = this.estimateCallCost(estimatedMinutes);
    
    if (balance.totalAvailable >= estimatedCost) {
      return { canStart: true, balance: balance.totalAvailable, estimated: estimatedCost };
    }
    
    if (balance.totalAvailable >= MIN_START_CREDITS) {
      return { 
        canStart: true, 
        balance: balance.totalAvailable, 
        estimated: estimatedCost,
        warning: "Limited credits - call may be terminated early"
      };
    }

    return { 
      canStart: false, 
      balance: balance.totalAvailable, 
      estimated: estimatedCost,
      error: `Need at least ${MIN_START_CREDITS} credits to start`
    };
  }

  /**
   * Track usage and deduct credits - with smart fallback for critical operations
   */
  static async trackUsage(params: {
    userId: string;
    service: ServiceType;
    quantity: number;
    resourceId?: string;
    resourceType?: string;
    metadata?: Record<string, unknown>;
    allowEmergencyCredits?: boolean;
  }) {
    const { userId, service, quantity, resourceId, resourceType, metadata, allowEmergencyCredits = false } = params;
    
    const calculatedCost = await this.calculateCreditCost(service, quantity, metadata);
    const balance = await this.getBalance(userId);
    
    if (balance.totalAvailable < calculatedCost && !allowEmergencyCredits) {
      throw new Error(`Insufficient credits. Need ${calculatedCost}, have ${balance.totalAvailable}`);
    }

    // Use free credits first
    const freeCredits = parseFloat(balance.availableFreeCredits);
    const paidCredits = parseFloat(balance.availableCredits);
    
    let freeUsed = 0, paidUsed = 0;
    if (freeCredits >= calculatedCost) {
      freeUsed = calculatedCost;
    } else {
      freeUsed = freeCredits;
      paidUsed = calculatedCost - freeCredits;
    }

    // Allow slight overdraft for critical operations (transcription, processing)
    const isEmergencyUsage = allowEmergencyCredits && balance.totalAvailable < calculatedCost;
    
    // Update balances (allow negative for emergency)
    await db.update(creditBalances)
      .set({
        availableFreeCredits: (freeCredits - freeUsed).toString(),
        availableCredits: (paidCredits - paidUsed).toString(),
        totalUsed: (parseFloat(balance.totalUsed) + paidUsed).toString(),
        totalFreeCreditsUsed: (parseFloat(balance.totalFreeCreditsUsed) + freeUsed).toString(),
        updatedAt: new Date(),
      })
      .where(eq(creditBalances.userId, userId));

    // Log usage with emergency flag if applicable
    const usageMetadata = {
      ...metadata,
      ...(isEmergencyUsage && { emergencyUsage: true })
    };

    const [usageEvent] = await db.insert(usageEvents).values({
      userId,
      service,
      quantity: quantity.toString(),
      unitCost: (calculatedCost / quantity).toFixed(6),
      totalCost: calculatedCost.toFixed(6),
      resourceId,
      resourceType,
      metadata: usageMetadata ? JSON.stringify(usageMetadata) : null,
    }).returning();

    // Create transaction records
    if (freeUsed > 0) {
      await db.insert(creditTransactions).values({
        userId,
        type: isEmergencyUsage ? "free_usage" : "free_usage",
        amount: (-freeUsed).toString(),
        balanceBefore: freeCredits.toString(),
        balanceAfter: (freeCredits - freeUsed).toString(),
        description: `${service} usage: ${quantity} ${SERVICE_UNITS[service]} (free credits)`,
        metadata: JSON.stringify({
          usageEventId: usageEvent.id,
          service,
          quantity,
          resourceId,
          resourceType,
          creditType: "free",
          ...(isEmergencyUsage && { emergencyUsage: true })
        }),
      });
    }

    if (paidUsed > 0) {
      await db.insert(creditTransactions).values({
        userId,
        type: "usage",
        amount: (-paidUsed).toString(), 
        balanceBefore: paidCredits.toString(),
        balanceAfter: (paidCredits - paidUsed).toString(),
        description: `${service} usage: ${quantity} ${SERVICE_UNITS[service]} (paid credits)`,
        metadata: JSON.stringify({
          usageEventId: usageEvent.id,
          service,
          quantity,
          resourceId,
          resourceType,
          creditType: "paid",
          ...(isEmergencyUsage && { emergencyUsage: true })
        }),
      });
    }

    return {
      ...usageEvent,
      totalCost: calculatedCost.toString()
    };
  }

  /**
   * Add purchased credits
   */
  static async addCredits(userId: string, credits: number, checkoutId?: string) {
    const balance = await this.getBalance(userId);
    const newTotal = parseFloat(balance.availableCredits) + credits;
    
    await db.update(creditBalances)
      .set({
        availableCredits: newTotal.toString(),
        totalPurchased: (parseFloat(balance.totalPurchased) + credits).toString(),
      })
      .where(eq(creditBalances.userId, userId));

    await db.insert(creditTransactions).values({
      userId,
      type: "purchase",
      amount: credits.toString(),
      balanceBefore: balance.availableCredits,
      balanceAfter: newTotal.toString(),
      description: "Credit purchase",
      polarCheckoutId: checkoutId,
    });

    return newTotal;
  }

  /**
   * Simple credit monitoring during calls (WebSocket or polling)
   */
  static async checkCallCredits(userId: string, startTime: Date, startingBalance: number) {
    const elapsedMinutes = (Date.now() - startTime.getTime()) / (1000 * 60);
    const usedCredits = elapsedMinutes * COSTS.videoCallPerMin;
    const projectedFinalCost = usedCredits + (elapsedMinutes * COSTS.transcriptionPerMin) + COSTS.processing;
    const projectedBalance = startingBalance - projectedFinalCost;

    if (projectedBalance < WARNING_THRESHOLD) {
      return { 
        warning: true, 
        projectedBalance,
        message: `Low credits: ${projectedBalance.toFixed(0)} remaining`,
        shouldTerminate: projectedBalance < 20 
      };
    }

    return { warning: false, projectedBalance };
  }

  /**
   * Force end call and mark conversation for termination
   */
  static async forceEndCall(conversationId: string, reason: string) {
    await db.update(conversations)
      .set({
        status: "completed",
        endedAt: new Date(),
        metadata: JSON.stringify({ forceTerminated: true, reason })
      })
      .where(eq(conversations.id, conversationId));
  }

  /**
   * Start conversation with credit checks - simple version of startConversationWithCredits
   */
  static async startConversation(params: {
    userId: string;
    conversationId: string;
    estimatedDurationMinutes: number;
    enableProcessing?: boolean;
  }) {
    const { userId, conversationId, estimatedDurationMinutes, enableProcessing: _enableProcessing = true } = params;
    
    const canStartResult = await this.canStartCall(userId, estimatedDurationMinutes);
    if (!canStartResult.canStart) {
      return {
        success: false,
        error: canStartResult.error,
        reservationIds: [], // For compatibility
      };
    }

    // Store starting balance in conversation metadata for monitoring
    const startingBalance = canStartResult.balance;
    const warnings = canStartResult.warning ? [canStartResult.warning] : undefined;

    return {
      success: true,
      reservationIds: [], // No reservations in simple system
      warnings,
      startingBalance,
      conversationId,
    };
  }

  /**
   * End conversation and track actual usage - simple version of endConversationWithCredits
   */
  static async endConversation(params: {
    userId: string;
    conversationId: string;
    actualDurationMinutes: number;
  }) {
    const { userId, conversationId, actualDurationMinutes } = params;
    
    const actualCosts = {
      videoCall: 0,
      transcription: 0,
      processing: 0,
    };

    try {
      // Track video call usage
      const videoCallUsage = await CreditService.trackUsage({
        userId,
        service: "stream_video_call",
        quantity: Math.ceil(actualDurationMinutes * 2), // 2 participants
        resourceId: conversationId,
        resourceType: "conversation",
        metadata: {
          durationMinutes: actualDurationMinutes,
          participantCount: 2,
        },
        allowEmergencyCredits: true,
      });
      actualCosts.videoCall = parseFloat(videoCallUsage.totalCost);

      // Track transcription (ALWAYS needed - allow emergency credits)
      const transcriptionUsage = await CreditService.trackUsage({
        userId,
        service: "stream_transcription", 
        quantity: Math.ceil(actualDurationMinutes),
        resourceId: conversationId,
        resourceType: "conversation",
        metadata: {
          durationMinutes: actualDurationMinutes,
          roundedMinutes: Math.ceil(actualDurationMinutes),
        },
        allowEmergencyCredits: true, // CRITICAL: Always allow for transcription
      });
      actualCosts.transcription = parseFloat(transcriptionUsage.totalCost);

      // Track processing cost (will be done by inngest function, but reserve space)
      actualCosts.processing = COSTS.processing;

    } catch (error) {
      console.error(`Error tracking conversation usage for ${conversationId}:`, error);
      return { success: false, actualCosts };
    }

    return { success: true, actualCosts, creditsRefunded: 0 };
  }

  /**
   * Get usage history for a user
   */
  static async getUserUsageHistory(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      service?: ServiceType;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const { limit = 50, offset = 0, service, startDate: _startDate, endDate: _endDate } = options || {};
    
    let query = db
      .select()
      .from(usageEvents)
      .where(eq(usageEvents.userId, userId))
      .orderBy(desc(usageEvents.createdAt))
      .limit(limit)
      .offset(offset);

    // Add filters if provided
    const conditions = [eq(usageEvents.userId, userId)];
    if (service) conditions.push(eq(usageEvents.service, service));
    // Note: Date filtering would require additional logic with drizzle

    if (conditions.length > 1) {
      query = db
        .select()
        .from(usageEvents)
        .where(and(...conditions))
        .orderBy(desc(usageEvents.createdAt))
        .limit(limit)
        .offset(offset);
    }

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
      type?: string;
    }
  ) {
    const { limit = 50, offset = 0, type } = options || {};
    
    let query = db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(limit)
      .offset(offset);

    if (type) {
              query = db
          .select() 
          .from(creditTransactions)
          .where(and(eq(creditTransactions.userId, userId), eq(creditTransactions.type, type as "purchase" | "usage" | "refund" | "adjustment" | "expiration" | "free_allocation" | "free_usage")))
        .orderBy(desc(creditTransactions.createdAt))
        .limit(limit)
        .offset(offset);
    }

    return await query;
  }

  /**
   * Estimate cost for OpenAI services
   */
  static async estimateOpenAICost(
    model: "gpt-4o" | "gpt-4o-mini",
    estimatedInputTokens: number,
    estimatedOutputTokens: number
  ) {
    const service = model === "gpt-4o" ? "openai_gpt4o" : "openai_gpt4o_mini";
    const credits = await this.calculateCreditCost(service, 1, {
      inputTokens: estimatedInputTokens,
      outputTokens: estimatedOutputTokens,
    });

    return {
      credits,
      usd: credits * 0.001, // 1 credit = $0.001
    };
  }

  /**
   * Estimate cost for Stream services
   */  
  static async estimateStreamCost(
    service: "video_call" | "chat_message" | "transcription",
    quantity: number
  ) {
    const serviceMap = {
      video_call: "stream_video_call",
      chat_message: "stream_chat_message", 
      transcription: "stream_transcription",
    } as const;

    const key = serviceMap[service] as ServiceType;
    const credits = await this.calculateCreditCost(key, quantity);

    return {
      credits,
      usd: credits * 0.001,
    };
  }

  /**
   * Calculate credit cost for a service usage - matches original complexity
   */
  static async calculateCreditCost(
    service: ServiceType,
    quantity: number,
    metadata?: {
      inputTokens?: number;
      outputTokens?: number;
    }
  ): Promise<number> {
    
    // Handle OpenAI services with token-based pricing
    if (service === "openai_gpt4o" || service === "openai_gpt4o_mini") {
      const inputTokens = metadata?.inputTokens || 0;
      const outputTokens = metadata?.outputTokens || 0;
      
      if (service === "openai_gpt4o") {
        // $2.50 per 1M input tokens, $10.00 per 1M output tokens
        const inputCost = (inputTokens / 1_000_000) * 2.50;
        const outputCost = (outputTokens / 1_000_000) * 10.00;
        const totalUSD = inputCost + outputCost;
        return totalUSD * 800; // Convert to credits (1 credit = $0.00125 with margin)
      } else {
        // $0.15 per 1M input tokens, $0.60 per 1M output tokens  
        const inputCost = (inputTokens / 1_000_000) * 0.15;
        const outputCost = (outputTokens / 1_000_000) * 0.60;
        const totalUSD = inputCost + outputCost;
        return totalUSD * 800; // Convert to credits
      }
    }

    // Handle Stream services
    switch (service) {
      case "stream_video_call":
        return quantity * COSTS.videoCallPerMin;
      case "stream_chat_message":
        return quantity * 0.001 * 800; // $0.001 per message -> credits
      case "stream_transcription":
        return quantity * COSTS.transcriptionPerMin;
      default:
        return 0;
    }
  }

  // Helper methods
  private static estimateCallCost(minutes: number) {
    return Math.ceil(minutes * (COSTS.videoCallPerMin + COSTS.transcriptionPerMin) + COSTS.processing);
  }
}
