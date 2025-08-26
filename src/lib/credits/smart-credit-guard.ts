import { CreditMeteringService } from "./metering";
import { CREDIT_FORCE_TERMINATION_THRESHOLD, CREDIT_WARNING_THRESHOLD, CREDIT_CRITICAL_WINDOW_MS } from "./constants";
import Decimal from "decimal.js";

type DecimalValue = InstanceType<typeof Decimal>;

interface CreditReservation {
  id: string;
  userId: string;
  reservedAmount: DecimalValue;
  resourceId: string;
  resourceType: "video_call" | "transcription" | "conversation_processing";
  createdAt: Date;
  expiresAt: Date;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

interface OperationEstimate {
  estimatedCredits: DecimalValue;
  breakdown: {
    videoCall?: { durationMinutes: number; credits: DecimalValue };
    transcription?: { durationMinutes: number; credits: DecimalValue };
    processing?: { complexity: "simple" | "medium" | "complex"; credits: DecimalValue };
  };
  bufferCredits: DecimalValue;
  totalWithBuffer: DecimalValue;
}

export class SmartCreditGuard {
  private static reservations = new Map<string, CreditReservation>();
  
  // Credit buffers for different operation types (stricter for overdraft prevention)
  private static readonly BUFFERS = {
    VIDEO_CALL: 20, // Reduced buffer - prevent overdraft
    TRANSCRIPTION: 30, // Reduced but still ensure transcription of recorded portion
    PROCESSING: 50, // Reduced processing buffer
    EMERGENCY: 50, // Reduced emergency buffer - only for transcription of recorded content
  };

  /**
   * Pre-flight check: Estimate and verify credits before starting operations
   */
  static async preflightCheck(params: {
    userId: string;
    operations: {
      videoCall?: { estimatedDurationMinutes: number };
      transcription?: { estimatedDurationMinutes: number };
      processing?: { complexity?: "simple" | "medium" | "complex" };
    };
    resourceId: string;
    resourceType: "conversation" | "session";
  }): Promise<{
    canAfford: boolean;
    estimate: OperationEstimate;
    currentBalance: { total: DecimalValue; paid: DecimalValue; free: DecimalValue };
    recommendations?: string[];
  }> {
    const { userId, operations } = params;
    
    // Get current balance
    const balance = await CreditMeteringService.getUserBalance(userId);
    const totalAvailable = balance.availableCredits.plus(balance.availableFreeCredits);
    
    // Calculate estimates
    const estimate: OperationEstimate = {
      estimatedCredits: new Decimal(0),
      breakdown: {},
      bufferCredits: new Decimal(0),
      totalWithBuffer: new Decimal(0),
    };

    // Video call estimate (2 participants: user + AI)
    if (operations.videoCall) {
      const participantMinutes = operations.videoCall.estimatedDurationMinutes * 2;
      const videoCallCredits = await CreditMeteringService.estimateStreamCost(
        "video_call", 
        participantMinutes
      );
      
      estimate.breakdown.videoCall = {
        durationMinutes: operations.videoCall.estimatedDurationMinutes,
        credits: new Decimal(videoCallCredits.credits),
      };
      estimate.estimatedCredits = estimate.estimatedCredits.plus(videoCallCredits.credits);
      estimate.bufferCredits = estimate.bufferCredits.plus(this.BUFFERS.VIDEO_CALL);
    }

    // Transcription estimate
    if (operations.transcription) {
      const transcriptionCredits = await CreditMeteringService.estimateStreamCost(
        "transcription",
        operations.transcription.estimatedDurationMinutes
      );
      
      estimate.breakdown.transcription = {
        durationMinutes: operations.transcription.estimatedDurationMinutes,
        credits: new Decimal(transcriptionCredits.credits),
      };
      estimate.estimatedCredits = estimate.estimatedCredits.plus(transcriptionCredits.credits);
      estimate.bufferCredits = estimate.bufferCredits.plus(this.BUFFERS.TRANSCRIPTION);
    }

    // Processing estimate
    if (operations.processing) {
      const complexity = operations.processing.complexity || "medium";
      const processingCredits = this.estimateProcessingCost(complexity);
      
      estimate.breakdown.processing = {
        complexity,
        credits: new Decimal(processingCredits),
      };
      estimate.estimatedCredits = estimate.estimatedCredits.plus(processingCredits);
      estimate.bufferCredits = estimate.bufferCredits.plus(this.BUFFERS.PROCESSING);
    }

    estimate.totalWithBuffer = estimate.estimatedCredits.plus(estimate.bufferCredits);
    
    const canAfford = totalAvailable.greaterThanOrEqualTo(estimate.totalWithBuffer);
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (!canAfford) {
      const shortfall = estimate.totalWithBuffer.minus(totalAvailable);
      recommendations.push(`You need ${shortfall.toFixed(0)} more credits to start this conversation safely`);
      
      // Check if we can afford with simplified processing
      if (operations.processing) {
        const simplifiedEstimate = estimate.estimatedCredits.minus(estimate.breakdown.processing?.credits || new Decimal(0)).plus(this.estimateProcessingCost("simple"));
        const simplifiedWithBuffer = simplifiedEstimate.plus(estimate.bufferCredits);
        
        if (totalAvailable.greaterThanOrEqualTo(simplifiedWithBuffer)) {
          recommendations.push("You can start with simplified processing to reduce costs");
        }
      }
      
      if (totalAvailable.greaterThanOrEqualTo(estimate.estimatedCredits)) {
        recommendations.push("You can start but may need emergency credits for completion");
      }
    } else if (totalAvailable.lessThan(estimate.totalWithBuffer.times(1.5))) {
      recommendations.push("Consider purchasing more credits soon to avoid using emergency buffer");
    }

    return {
      canAfford,
      estimate,
      currentBalance: {
        total: totalAvailable,
        paid: balance.availableCredits,
        free: balance.availableFreeCredits,
      },
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    };
  }

  /**
   * Reserve credits for an ongoing operation
   */
  static async reserveCredits(params: {
    userId: string;
    amount: number;
    resourceId: string;
    resourceType: "video_call" | "transcription" | "conversation_processing";
    expiresInMinutes?: number;
    metadata?: Record<string, string | number | boolean | null | undefined>;
  }): Promise<{ success: boolean; reservationId?: string; error?: string }> {
    const { userId, amount, resourceId, resourceType, expiresInMinutes = 60, metadata } = params;
    
    // Check if user has sufficient credits
    const balance = await CreditMeteringService.getUserBalance(userId);
    const totalAvailable = balance.availableCredits.plus(balance.availableFreeCredits);
    if (totalAvailable.lessThan(amount)) {
      return { success: false, error: "Insufficient credits to reserve" };
    }

    const reservationId = `${resourceType}_${resourceId}_${Date.now()}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresInMinutes * 60 * 1000);

    const reservation: CreditReservation = {
      id: reservationId,
      userId,
      reservedAmount: new Decimal(amount),
      resourceId,
      resourceType,
      createdAt: now,
      expiresAt,
      metadata,
    };

    this.reservations.set(reservationId, reservation);

    // Clean up expired reservations
    this.cleanupExpiredReservations();

    return { success: true, reservationId };
  }

  /**
   * Release a credit reservation (when operation completes or is cancelled)
   */
  static async releaseReservation(reservationId: string): Promise<boolean> {
    const reservation = this.reservations.get(reservationId);
    if (!reservation) return false;

    this.reservations.delete(reservationId);
    return true;
  }

  /**
   * Check if operation can continue based on current credit levels
   */
  static async canContinueOperation(params: {
    userId: string;
    operationType: "video_call" | "transcription" | "processing";
    estimatedRemainingCost?: number;
    allowEmergencyBuffer?: boolean;
  }): Promise<{
    canContinue: boolean;
    reason?: string;
    gracefulDegradation?: {
      simplifyProcessing?: boolean;
      useEmergencyCredits?: boolean;
      earlyTermination?: boolean;
    };
  }> {
    const { userId, operationType, estimatedRemainingCost = 0, allowEmergencyBuffer = false } = params;
    
    const balance = await CreditMeteringService.getUserBalance(userId);
    const totalAvailable = balance.availableCredits.plus(balance.availableFreeCredits);
    
    const emergencyBuffer = allowEmergencyBuffer ? this.BUFFERS.EMERGENCY : 0;
    const availableForOperation = totalAvailable.minus(emergencyBuffer);
    
    // Can continue if we have enough credits
    if (availableForOperation.greaterThanOrEqualTo(estimatedRemainingCost)) {
      return { canContinue: true };
    }

    // Determine graceful degradation options
    const gracefulDegradation: {
      simplifyProcessing?: boolean;
      useEmergencyCredits?: boolean;
      earlyTermination?: boolean;
    } = {};
    
    // For all operations, try emergency buffer first
    if (allowEmergencyBuffer && totalAvailable.plus(this.BUFFERS.EMERGENCY).greaterThanOrEqualTo(estimatedRemainingCost)) {
      gracefulDegradation.useEmergencyCredits = true;
      return {
        canContinue: true,
        reason: "Using emergency credit buffer to continue operation",
        gracefulDegradation,
      };
    }
    
    if (operationType === "video_call") {
      // For video calls, we need to continue but warn about potential issues
      if (totalAvailable.greaterThanOrEqualTo(estimatedRemainingCost * 0.7)) {
        return {
          canContinue: true,
          reason: "Continuing call with potential for emergency credit usage",
        };
      } else {
        gracefulDegradation.earlyTermination = true;
        return {
          canContinue: false,
          reason: "Insufficient credits to continue call safely, consider ending soon",
          gracefulDegradation,
        };
      }
    }

    if (operationType === "processing") {
      // For processing, we can simplify the complexity
      if (totalAvailable.greaterThanOrEqualTo(this.estimateProcessingCost("simple"))) {
        gracefulDegradation.simplifyProcessing = true;
        return {
          canContinue: true,
          reason: "Using simplified processing to preserve credits",
          gracefulDegradation,
        };
      }
    }

    if (operationType === "transcription") {
      // Transcription is ALWAYS required - use emergency credits if needed
      if (allowEmergencyBuffer) {
        gracefulDegradation.useEmergencyCredits = true;
        return {
          canContinue: true,
          reason: "Using emergency credits for required transcription",
          gracefulDegradation,
        };
      }
    }

    return {
      canContinue: false,
      reason: `Insufficient credits for ${operationType}. Current balance: ${totalAvailable.toFixed(0)} credits`,
    };
  }

  /**
   * Monitor credits during long-running operations with strict overdraft prevention
   */
  static async monitorOperation(params: {
    userId: string;
    operationType: "video_call" | "processing";
    resourceId: string;
    onLowCredits?: (credits: DecimalValue, recommendations: string[]) => void;
    onForceTermination?: (reason: string) => void;
    checkIntervalMs?: number;
    estimatedMinutesRemaining?: () => number;
    startingBalance?: number;
  }): Promise<{ stopMonitoring: () => void }> {
    const { 
      userId, 
      operationType, 
      resourceId: _resourceId, 
      onLowCredits, 
      onForceTermination, 
      checkIntervalMs = 15000, // Check every 15 seconds for tighter control
      estimatedMinutesRemaining,
      startingBalance
    } = params;
    
    let monitoring = true;
    let firstCriticalWarningTime: Date | null = null;
    const CRITICAL_WARNING_DURATION_MS = CREDIT_CRITICAL_WINDOW_MS;
    const startTime = new Date().getTime();
    
    const monitorFn = async () => {
      if (!monitoring) return;
      
      let totalAvailable: DecimalValue;
      
      if (startingBalance !== undefined && operationType === "video_call") {
        // Calculate projected balance INCLUDING all future costs (video calls)
        const elapsedMinutes = (new Date().getTime() - startTime) / (1000 * 60);
        const videoCostPerMin = 0.8;  // Video call cost per minute
        const transcriptionCostPerMin = 7.2; // Transcription cost per minute (deducted at end)
        const processingCost = 38; // Processing cost (deducted at end)
        
        // Total costs: ongoing video + future transcription of full call + processing
        const videoCreditsUsed = elapsedMinutes * videoCostPerMin;
        const futureTranscriptionCost = elapsedMinutes * transcriptionCostPerMin;
        const totalProjectedCost = videoCreditsUsed + futureTranscriptionCost + processingCost;
        const projectedBalance = startingBalance - totalProjectedCost;
        totalAvailable = new Decimal(Math.max(0, projectedBalance));
        
        console.warn(`Backend monitoring: ${elapsedMinutes.toFixed(1)}min elapsed, total projected cost: ${totalProjectedCost.toFixed(1)}, projected final balance: ${projectedBalance.toFixed(1)}`);
      } else {
        // Fallback to checking actual balance for non-video operations
        const balance = await CreditMeteringService.getUserBalance(userId);
        totalAvailable = balance.availableCredits.plus(balance.availableFreeCredits);
      }
      
      // Calculate projected cost to completion (conservative estimate)
      const minutesRemaining = estimatedMinutesRemaining ? estimatedMinutesRemaining() : 5; // Default 5 min - less aggressive
      const projectedCost = this.calculateProjectedCost(operationType, minutesRemaining);
      
      // Less aggressive thresholds - give more time before termination
      // Fixed thresholds - only warn when actually close to termination  
      const FORCE_TERMINATION_THRESHOLD = CREDIT_FORCE_TERMINATION_THRESHOLD;
      const WARNING_THRESHOLD = CREDIT_WARNING_THRESHOLD;
      
      // Early warning system - start warnings when getting low but don't terminate immediately
      if (totalAvailable.lessThan(WARNING_THRESHOLD) && onLowCredits) {
        onLowCredits(totalAvailable, [
          `Warning: ${totalAvailable.toFixed(0)} credits remaining`,
          `Call will auto-terminate at 25 credits (with ~20 credit tolerance)`,
          `Consider ending call soon to avoid forced termination`
        ]);
      }
      
      // Critical termination logic - only when very close to insufficient credits
      if (totalAvailable.lessThan(FORCE_TERMINATION_THRESHOLD)) {
        if (!firstCriticalWarningTime) {
          firstCriticalWarningTime = new Date();
        }
        
        const timeInCritical = new Date().getTime() - firstCriticalWarningTime.getTime();
        const remainingTime = Math.max(0, CRITICAL_WARNING_DURATION_MS - timeInCritical);
        const remainingMinutes = Math.ceil(remainingTime / 1000 / 60);
        
        if (remainingTime > 0 && onLowCredits) {
          // Still in warning period
          onLowCredits(totalAvailable, [
            `CRITICAL: Only ${totalAvailable.toFixed(0)} credits remaining!`,
            `Call will auto-terminate at 25 credits to leave ~20 credits buffer`,
            `Auto-termination in ${remainingMinutes} minutes - please end call now`,
            `This prevents excessive overdraft while allowing reasonable tolerance`
          ]);
        } else if (onForceTermination) {
          // 3 minutes of warnings have passed - force terminate
          monitoring = false;
          onForceTermination(
            `Call terminated after 3 minutes of warnings to prevent overdraft. Available: ${totalAvailable.toFixed(0)} credits, Projected: ${projectedCost} credits`
          );
          return;
        }
      } else {
        // Reset critical warning timer if credits are sufficient again
        firstCriticalWarningTime = null;
      }
      
      if (monitoring) {
        setTimeout(monitorFn, checkIntervalMs);
      }
    };
    
    // Start monitoring immediately
    monitorFn();
    
    return {
      stopMonitoring: () => {
        monitoring = false;
      },
    };
  }

  /**
   * Calculate projected cost for remaining operation time
   */
  private static calculateProjectedCost(operationType: "video_call" | "processing", minutesRemaining: number): number {
    if (operationType === "video_call") {
      // Video: 0.8 credits/min + Transcription: 7.2 credits/min = 8 credits/min total
      return Math.ceil(minutesRemaining * 8);
    } else if (operationType === "processing") {
      // Processing is typically a one-time cost, not per-minute
      return 50; // Simple processing cost
    }
    return 0;
  }

  /**
   * Handle insufficient credits with smart options
   */
  static async handleInsufficientCredits(params: {
    userId: string;
    requiredCredits: number;
    operationType: string;
    context?: {
      resourceId?: string;
      resourceType?: string;
      canDegrade?: boolean;
      emergencyCompletion?: boolean;
    };
  }): Promise<{
    action: "block" | "allow_with_degradation" | "emergency_completion";
    message: string;
    degradationOptions?: Record<string, boolean>;
  }> {
    const { userId, requiredCredits, operationType, context } = params;
    
    const balance = await CreditMeteringService.getUserBalance(userId);
    const totalAvailable = balance.availableCredits.plus(balance.availableFreeCredits);
    
    // If we have emergency buffer and this is critical completion
    if (context?.emergencyCompletion && totalAvailable.greaterThanOrEqualTo(this.BUFFERS.EMERGENCY)) {
      return {
        action: "emergency_completion",
        message: "Using emergency credit buffer to complete operation",
      };
    }
    
    // If we can degrade the operation (only processing can be simplified)
    if (context?.canDegrade && operationType.includes("processing")) {
      return {
        action: "allow_with_degradation",
        message: "Continuing with simplified processing to preserve credits",
        degradationOptions: {
          simplifyProcessing: true,
        },
      };
    }
    
    // Otherwise, block the operation
    const shortfall = new Decimal(requiredCredits).minus(totalAvailable);
    return {
      action: "block",
      message: `You need ${shortfall.toFixed(0)} more credits to ${operationType}. Current balance: ${totalAvailable.toFixed(0)} credits.`,
    };
  }

  // Helper methods
  private static estimateProcessingCost(complexity: "simple" | "medium" | "complex"): number {
    const costs = {
      simple: 50,   // Basic summarization
      medium: 150,  // Full processing with insights
      complex: 300, // Deep analysis with recommendations
    };
    return costs[complexity];
  }

  private static async estimateTranscriptionCost(durationMinutes: number): Promise<number> {
    const result = await CreditMeteringService.estimateStreamCost("transcription", durationMinutes);
    return result.credits;
  }

  private static cleanupExpiredReservations(): void {
    const now = new Date();
    for (const [id, reservation] of this.reservations.entries()) {
      if (reservation.expiresAt < now) {
        this.reservations.delete(id);
      }
    }
  }

  /**
   * Get all active reservations for a user
   */
  static async getUserReservations(userId: string): Promise<CreditReservation[]> {
    this.cleanupExpiredReservations();
    return Array.from(this.reservations.values()).filter(r => r.userId === userId);
  }

  /**
   * Get total reserved credits for a user
   */
  static async getTotalReservedCredits(userId: string): Promise<DecimalValue> {
    const reservations = await this.getUserReservations(userId);
    return reservations.reduce((total, reservation) => 
      total.plus(reservation.reservedAmount), new Decimal(0)
    );
  }
}
