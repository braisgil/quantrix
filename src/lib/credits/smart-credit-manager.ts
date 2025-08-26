import { CreditMeteringService } from "./metering";
import { SmartCreditGuard } from "./smart-credit-guard";
import Decimal from "decimal.js";

type DecimalValue = InstanceType<typeof Decimal>;

/**
 * Smart credit management service with pre-flight checks and graceful degradation
 * This is a standalone service that uses CreditMeteringService internally
 */
export class SmartCreditManager {
  
  /**
   * Smart conversation start with pre-flight credit checks
   * Note: Transcription is ALWAYS enabled as it's required for app functionality
   */
  static async startConversationWithCredits(params: {
    userId: string;
    conversationId: string;
    estimatedDurationMinutes: number;
    enableProcessing?: boolean;
    processingComplexity?: "simple" | "medium" | "complex";
  }): Promise<{
    success: boolean;
    reservationIds: string[];
    warnings?: string[];
    degradation?: {
      processingSimplified?: boolean;
      usingEmergencyCredits?: boolean;
    };
    error?: string;
  }> {
    const { 
      userId, 
      conversationId, 
      estimatedDurationMinutes, 
      enableProcessing = true,
      processingComplexity = "medium"
    } = params;

    // Pre-flight check - Transcription is ALWAYS included
    const preflightResult = await SmartCreditGuard.preflightCheck({
      userId,
      operations: {
        videoCall: { estimatedDurationMinutes },
        transcription: { estimatedDurationMinutes }, // Always included
        processing: enableProcessing ? { complexity: processingComplexity } : undefined,
      },
      resourceId: conversationId,
      resourceType: "conversation",
    });

    const reservationIds: string[] = [];
    const warnings: string[] = [];
    const degradation: {
      processingSimplified?: boolean;
      usingEmergencyCredits?: boolean;
    } = {};

    if (!preflightResult.canAfford) {
      // Try graceful degradation - only processing can be simplified
      let canProceedWithDegradation = false;
      
      // Try with simplified processing
      if (enableProcessing && processingComplexity !== "simple") {
        const simplified = await SmartCreditGuard.preflightCheck({
          userId,
          operations: {
            videoCall: { estimatedDurationMinutes },
            transcription: { estimatedDurationMinutes }, // Always included
            processing: { complexity: "simple" },
          },
          resourceId: conversationId,
          resourceType: "conversation",
        });

        if (simplified.canAfford) {
          degradation.processingSimplified = true;
          warnings.push("Conversation processing simplified to reduce costs");
          canProceedWithDegradation = true;
        }
      }

      // If still can't afford full duration, check if we can allow a shorter call with monitoring
      if (!canProceedWithDegradation) {
        const creditStatus = await SmartCreditManager.getCreditStatus(userId);
        const available = creditStatus.balance.available;
        
        // Calculate how many minutes they can afford (minimum 5 minutes to be worthwhile)
        const costPerMinute = 8; // video + transcription per minute
        const processingCost = 38; // processing cost
        const affordableMinutes = Math.floor(available.minus(processingCost).toNumber() / costPerMinute);
        
        if (affordableMinutes >= 5) {
          // Allow call but with strong warnings about early termination
          degradation.usingEmergencyCredits = true;
          warnings.push(`Limited budget: ~${affordableMinutes} minutes available with strict monitoring`);
          warnings.push("Call will be terminated automatically when credits run low");
          warnings.push("Consider purchasing more credits for longer conversations");
          canProceedWithDegradation = true;
        } else {
          // Still check emergency credits for very short calls
          const availableWithEmergency = available.plus(50);
          const shortfall = preflightResult.estimate.estimatedCredits.minus(available);
          if (shortfall.lessThanOrEqualTo(80) && availableWithEmergency.greaterThanOrEqualTo(40)) { // Allow very short calls
            degradation.usingEmergencyCredits = true;
            warnings.push("Very limited budget - call may be very short with automatic termination");
            canProceedWithDegradation = true;
          }
        }
      }

      // If still can't afford, check if user has minimum credits to start (25+ credits)
      if (!canProceedWithDegradation) {
        const available = preflightResult.currentBalance.total;
        if (available.greaterThanOrEqualTo(30)) {
          // Allow call with minimum credits - monitoring will handle termination
          degradation.usingEmergencyCredits = true;
          warnings.push(`Limited credits: Call will start but may be short`);
          warnings.push(`Monitoring will terminate at 25 credits to prevent overdraft`);
          canProceedWithDegradation = true;
        } else {
          // Truly insufficient credits - block the call
          return {
            success: false,
            reservationIds: [],
            error: `Insufficient credits to start conversation. You need at least 30 credits to start a call (you have ${available.toFixed(0)}).`,
          };
        }
      }
    }

    // For limited credit scenarios, reserve minimal amounts and rely on monitoring
    if (degradation.usingEmergencyCredits) {
      // Reserve minimal credits - just enough to start
      const minReservation = await SmartCreditGuard.reserveCredits({
        userId,
        amount: 5, // Minimal reservation to start the call
        resourceId: conversationId,
        resourceType: "video_call",
        expiresInMinutes: 60,
        metadata: { estimatedDurationMinutes, limitedCredit: true },
      });
      
      if (minReservation.success && minReservation.reservationId) {
        reservationIds.push(minReservation.reservationId);
      }
    } else {
      // Normal credit reservation path
      const videoCallReservation = await SmartCreditGuard.reserveCredits({
        userId,
        amount: preflightResult.estimate.breakdown.videoCall?.credits.toNumber() || 0,
        resourceId: conversationId,
        resourceType: "video_call",
        expiresInMinutes: estimatedDurationMinutes + 30,
        metadata: { estimatedDurationMinutes },
      });

      if (videoCallReservation.success && videoCallReservation.reservationId) {
        reservationIds.push(videoCallReservation.reservationId);
      }

      // Reserve credits for transcription (ALWAYS needed)
      const transcriptionReservation = await SmartCreditGuard.reserveCredits({
        userId,
        amount: preflightResult.estimate.breakdown.transcription?.credits.toNumber() || 0,
        resourceId: conversationId,
        resourceType: "transcription",
        expiresInMinutes: estimatedDurationMinutes + 60,
        metadata: { estimatedDurationMinutes },
      });

      if (transcriptionReservation.success && transcriptionReservation.reservationId) {
        reservationIds.push(transcriptionReservation.reservationId);
      }
    }

    // Reserve credits for processing if enabled and not simplified
    if (enableProcessing) {
      const processingReservation = await SmartCreditGuard.reserveCredits({
        userId,
        amount: preflightResult.estimate.breakdown.processing?.credits.toNumber() || 0,
        resourceId: conversationId,
        resourceType: "conversation_processing",
        expiresInMinutes: 120, // 2 hours for processing
        metadata: { 
          complexity: degradation.processingSimplified ? "simple" : processingComplexity,
          conversationId 
        },
      });

      if (processingReservation.success && processingReservation.reservationId) {
        reservationIds.push(processingReservation.reservationId);
      }
    }

    return {
      success: true,
      reservationIds,
      warnings: warnings.length > 0 ? warnings : undefined,
      degradation: Object.keys(degradation).length > 0 ? degradation : undefined,
    };
  }

  /**
   * Strict credit tracking - limited emergency credits to prevent overdraft
   */
  static async trackUsageWithSmartFallback(params: {
    userId: string;
    service: keyof typeof import('./metering').SERVICE_UNITS;
    quantity: number;
    resourceId?: string;
    resourceType?: string;
    metadata?: Record<string, string | number | boolean | null | undefined>;
    allowEmergencyCredits?: boolean;
    reservationId?: string;
  }) {
    const { allowEmergencyCredits = false, reservationId, ...baseParams } = params;

    try {
      // Try normal tracking first
      return await CreditMeteringService.trackUsage(baseParams);
    } catch (error) {
      if (error instanceof Error && error.message === "Insufficient credits") {
        // Handle insufficient credits intelligently
        const handleResult = await SmartCreditGuard.handleInsufficientCredits({
          userId: baseParams.userId,
          requiredCredits: await CreditMeteringService.calculateCreditCost(
            baseParams.service, 
            baseParams.quantity, 
            baseParams.metadata
          ).then(c => c.toNumber()),
          operationType: baseParams.service,
          context: {
            resourceId: baseParams.resourceId,
            resourceType: baseParams.resourceType,
            emergencyCompletion: allowEmergencyCredits,
            canDegrade: false, // Usage tracking can't be degraded
          },
        });

        if (handleResult.action === "emergency_completion") {
          // Allow the usage to go through with emergency buffer
          try {
            // Force usage tracking (this might cause a small overdraft)
            const creditCost = await CreditMeteringService.calculateCreditCost(
              baseParams.service, 
              baseParams.quantity, 
              baseParams.metadata
            );

            // We'll allow small overdrafts in emergency situations
            return await SmartCreditManager.forceTrackUsage({ ...baseParams, creditCost });
          } catch (forceError) {
            throw new Error(`Emergency credit usage failed: ${forceError}`);
          }
        } else {
          // Re-throw the original error with enhanced message
          throw new Error(handleResult.message);
        }
      } else {
        // Re-throw non-credit-related errors
        throw error;
      }
    } finally {
      // Release reservation if provided
      if (reservationId) {
        await SmartCreditGuard.releaseReservation(reservationId);
      }
    }
  }

  /**
   * Force track usage even with insufficient credits (emergency situations)
   */
  private static async forceTrackUsage(params: {
    userId: string;
    service: keyof typeof import('./metering').SERVICE_UNITS;
    quantity: number;
    resourceId?: string;
    resourceType?: string;
    metadata?: Record<string, string | number | boolean | null | undefined>;
    creditCost: DecimalValue;
  }) {
    const { userId, service, quantity, resourceId, resourceType, metadata, creditCost } = params;

    // Get current balance (might be negative after this)
    const balance = await CreditMeteringService.getUserBalance(userId);

    // Determine how to split the cost between free and paid credits (allowing negative)
    let freeCreditsUsed = new Decimal(0);
    let paidCreditsUsed = new Decimal(0);

    if (balance.availableFreeCredits.greaterThanOrEqualTo(creditCost)) {
      freeCreditsUsed = creditCost;
    } else if (balance.availableFreeCredits.greaterThan(0)) {
      freeCreditsUsed = balance.availableFreeCredits;
      paidCreditsUsed = creditCost.minus(freeCreditsUsed);
    } else {
      paidCreditsUsed = creditCost;
    }

    // Calculate new balances (allowing negative values)
    const newAvailableFreeCredits = balance.availableFreeCredits.minus(freeCreditsUsed);
    const newAvailableCredits = balance.availableCredits.minus(paidCreditsUsed);
    const newTotalUsed = balance.totalUsed.plus(paidCreditsUsed);
    const newTotalFreeCreditsUsed = balance.totalFreeCreditsUsed.plus(freeCreditsUsed);

    // Update balance (allowing negative values in emergency)
    const { db } = await import("@/db");
    const { creditBalances, usageEvents, creditTransactions } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

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

    // Create usage event
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
        metadata: metadata ? JSON.stringify({ ...metadata, emergencyUsage: true }) : JSON.stringify({ emergencyUsage: true }),
      })
      .returning();

    // Create transaction records
    if (freeCreditsUsed.greaterThan(0)) {
      await db.insert(creditTransactions).values({
        userId,
        type: "free_usage",
        amount: freeCreditsUsed.neg().toFixed(6),
        balanceBefore: balance.availableFreeCredits.toFixed(6),
        balanceAfter: newAvailableFreeCredits.toFixed(6),
        description: `${service} usage: ${quantity} (emergency free credits)`,
        metadata: JSON.stringify({
          usageEventId: usageEvent.id,
          service,
          quantity,
          resourceId,
          resourceType,
          creditType: "free",
          emergencyUsage: true,
        }),
      });
    }

    if (paidCreditsUsed.greaterThan(0)) {
      await db.insert(creditTransactions).values({
        userId,
        type: "usage",
        amount: paidCreditsUsed.neg().toFixed(6),
        balanceBefore: balance.availableCredits.toFixed(6),
        balanceAfter: newAvailableCredits.toFixed(6),
        description: `${service} usage: ${quantity} (emergency paid credits)`,
        metadata: JSON.stringify({
          usageEventId: usageEvent.id,
          service,
          quantity,
          resourceId,
          resourceType,
          creditType: "paid",
          emergencyUsage: true,
        }),
      });
    }

    return usageEvent;
  }

  /**
   * End conversation and clean up reservations
   * Note: Transcription is ALWAYS processed as it's required for app functionality
   */
  static async endConversationWithCredits(params: {
    userId: string;
    conversationId: string;
    actualDurationMinutes: number;
    reservationIds: string[];
    processingComplexity?: "simple" | "medium" | "complex";
    hadProcessing?: boolean;
  }): Promise<{
    success: boolean;
    actualCosts: {
      videoCall?: number;
      transcription?: number;
      processing?: number;
    };
    creditsRefunded?: number;
  }> {
    const { 
      userId, 
      conversationId, 
      actualDurationMinutes, 
      reservationIds,
    } = params;

    const actualCosts: {
      videoCall?: number;
      transcription?: number;
      processing?: number;
    } = {};
    const creditsRefunded = 0;

    try {
      // Track actual video call usage
      const videoCallUsage = await SmartCreditManager.trackUsageWithSmartFallback({
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

      // Track transcription (ALWAYS needed for app functionality)
      try {
        const transcriptionUsage = await SmartCreditManager.trackUsageWithSmartFallback({
          userId,
          service: "stream_transcription",
          quantity: Math.ceil(actualDurationMinutes),
          resourceId: conversationId,
          resourceType: "conversation",
          metadata: {
            durationMinutes: actualDurationMinutes,
            roundedMinutes: Math.ceil(actualDurationMinutes),
          },
          allowEmergencyCredits: true, // ALWAYS allow emergency credits for transcription
        });

        actualCosts.transcription = parseFloat(transcriptionUsage.totalCost);
      } catch (error) {
        console.error(`CRITICAL: Transcription tracking failed for conversation ${conversationId}:`, error);
        // This is a critical failure since transcription is required
        return {
          success: false,
          actualCosts,
        };
      }

    } catch (error) {
      console.error(`Error tracking conversation usage: ${error}`);
      return {
        success: false,
        actualCosts,
      };
    } finally {
      // Always clean up reservations
      for (const reservationId of reservationIds) {
        await SmartCreditGuard.releaseReservation(reservationId);
      }
    }

    return {
      success: true,
      actualCosts,
      creditsRefunded,
    };
  }

  /**
   * Get comprehensive credit status for user
   */
  static async getCreditStatus(userId: string): Promise<{
    balance: {
      total: DecimalValue;
      paid: DecimalValue;
      free: DecimalValue;
      reserved: DecimalValue;
      available: DecimalValue;
    };
    status: "healthy" | "low" | "critical" | "overdraft";
    warnings: string[];
    recommendations: string[];
  }> {
    const balance = await CreditMeteringService.getUserBalance(userId);
    const totalReserved = await SmartCreditGuard.getTotalReservedCredits(userId);
    
    const total = balance.availableCredits.plus(balance.availableFreeCredits);
    const available = total.minus(totalReserved);
    
    let status: "healthy" | "low" | "critical" | "overdraft";
    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (available.lessThan(0)) {
      status = "overdraft";
      warnings.push("Account is in overdraft - please purchase credits immediately");
      recommendations.push("Purchase credits to restore positive balance");
    } else if (available.lessThan(50)) {
      status = "critical";
      warnings.push("Credits critically low - operations may fail");
      recommendations.push("Purchase credits before starting new conversations");
    } else if (available.lessThan(200)) {
      status = "low";
      warnings.push("Credits running low");
      recommendations.push("Consider purchasing more credits soon");
    } else {
      status = "healthy";
    }

    // Additional recommendations based on usage patterns
    if (totalReserved.greaterThan(total.times(0.8))) {
      warnings.push("High credit reservation ratio - monitor active operations");
    }

    return {
      balance: {
        total,
        paid: balance.availableCredits,
        free: balance.availableFreeCredits,
        reserved: totalReserved,
        available,
      },
      status,
      warnings,
      recommendations,
    };
  }
}
