import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface CreditEstimate {
  operation: string;
  estimatedCredits: number;
  canAfford: boolean;
  currentBalance: number;
  recommendations: string[];
  warnings: string[];
}

interface ConversationEstimate {
  canStart: boolean;
  totalEstimatedCredits: number;
  breakdown: {
    videoCall: number;
    transcription: number; // Always included - required for app functionality
    processing?: number;
  };
  warnings: string[];
  degradationOptions?: {
    withSimplifiedProcessing?: boolean;
    useEmergencyCredits?: boolean;
  };
}

/**
 * Hook for smart credit checking and management
 */
export function useSmartCreditGuard() {
  const [isChecking, setIsChecking] = useState(false);
  const trpc = useTRPC();

  // Get current credit balance
  const { data: creditBalance, refetch: refetchCreditBalance } = useQuery({
    ...trpc.credits.getBalance.queryOptions(),
    staleTime: 30 * 1000, // 30 seconds
  });

  // Estimate conversation costs
  // Note: Transcription is ALWAYS included as it's required for app functionality
  const estimateConversationCost = useCallback(async (params: {
    estimatedDurationMinutes: number;
    includeProcessing?: boolean;
    processingComplexity?: "simple" | "medium" | "complex";
  }): Promise<ConversationEstimate> => {
    setIsChecking(true);
    
    try {
      const { 
        estimatedDurationMinutes, 
        includeProcessing = true,
        processingComplexity = "medium"
      } = params;

      // Estimate video call (2 participants)  
      const participantMinutes = estimatedDurationMinutes * 2;
      const videoCallCost = Math.ceil(participantMinutes * 0.4); // 0.4 credits per participant minute (matches backend)

      // Estimate transcription (ALWAYS included - required for app functionality)
      const transcriptionCost = Math.ceil(estimatedDurationMinutes * 7.2); // 7.2 credits per minute (matches backend)

      const breakdown = {
        videoCall: videoCallCost,
        transcription: transcriptionCost, // Always included
        processing: 0, // Will be updated below if processing is enabled
      };

      let totalCredits = videoCallCost + transcriptionCost;

      // Estimate processing
      if (includeProcessing) {
        const processingCosts = {
          simple: 50,
          medium: 150,
          complex: 300,
        };
        const processingCost = processingCosts[processingComplexity];
        breakdown.processing = processingCost;
        totalCredits += processingCost;
      }

      const currentBalance = creditBalance?.totalAvailableCredits || 0;
      const canStart = currentBalance >= totalCredits;

      const warnings: string[] = [];
      const degradationOptions: {
        withSimplifiedProcessing?: boolean;
        useEmergencyCredits?: boolean;
      } = {};

      if (!canStart) {
        const shortfall = totalCredits - currentBalance;
        warnings.push(`You need ${shortfall} more credits to start this conversation (including required transcription)`);
        warnings.push("Recommended: 120 credits for 15-minute call with all features");

        // Check degradation options - only processing can be simplified
        if (includeProcessing && processingComplexity !== "simple") {
          const simpleCost = totalCredits - (breakdown.processing || 0) + 50;
          if (currentBalance >= simpleCost) {
            degradationOptions.withSimplifiedProcessing = true;
            warnings.push("You can start with simplified processing to reduce costs");
          }
        }

        // Check if emergency credits would help
        const emergencyBuffer = 100; // Emergency credit buffer
        if (currentBalance + emergencyBuffer >= totalCredits) {
          degradationOptions.useEmergencyCredits = true;
          warnings.push("You can start using emergency credit buffer");
        }
      } else if (currentBalance < totalCredits * 1.3) {
        warnings.push("Consider purchasing more credits to maintain a healthy buffer");
      }

      return {
        canStart,
        totalEstimatedCredits: totalCredits,
        breakdown,
        warnings,
        degradationOptions: Object.keys(degradationOptions).length > 0 ? degradationOptions : undefined,
      };
    } finally {
      setIsChecking(false);
    }
  }, [creditBalance]);

  // Estimate chat message cost
  const estimateChatCost = useCallback(async (params: {
    estimatedInputTokens?: number;
    estimatedOutputTokens?: number;
  }): Promise<CreditEstimate> => {
    const { estimatedInputTokens = 2000, estimatedOutputTokens = 500 } = params;
    
    // GPT-4o pricing: ~3125 credits per million input tokens, ~12500 per million output tokens
    const inputCredits = (estimatedInputTokens / 1_000_000) * 3125;
    const outputCredits = (estimatedOutputTokens / 1_000_000) * 12500;
    const chatMessageCredits = 1.25; // ~1.25 credits per message
    const totalCredits = Math.ceil(inputCredits + outputCredits + chatMessageCredits);

    const currentBalance = creditBalance?.totalAvailableCredits || 0;
    const canAfford = currentBalance >= totalCredits;

    const recommendations: string[] = [];
    const warnings: string[] = [];

    if (!canAfford) {
      const shortfall = totalCredits - currentBalance;
      warnings.push(`You need ${shortfall} more credits to send this message`);
      recommendations.push("Purchase more credits to continue chatting");
    } else if (currentBalance < 120) {
      warnings.push("Credits running low (< 15 minutes for calls)");
      recommendations.push("Consider purchasing more credits to ensure call availability");
    }

    return {
      operation: "chat_message",
      estimatedCredits: totalCredits,
      canAfford,
      currentBalance,
      recommendations,
      warnings,
    };
  }, [creditBalance]);

  // Check if user can afford a specific operation
  const canAfford = useCallback((requiredCredits: number): boolean => {
    return (creditBalance?.totalAvailableCredits || 0) >= requiredCredits;
  }, [creditBalance]);

  // Get user-friendly credit status
  const getCreditStatusMessage = useCallback((): {
    status: "healthy" | "low" | "critical" | "overdraft";
    message: string;
    color: "green" | "yellow" | "red";
  } => {
    if (!creditBalance) {
      return {
        status: "healthy",
        message: "Loading credit status...",
        color: "yellow",
      };
    }

    const available = creditBalance.totalAvailableCredits;

    if (available < 0) {
      return {
        status: "overdraft",
        message: `Account overdraft: ${Math.abs(available)} credits. Please purchase credits immediately.`,
        color: "red",
      };
    } else if (available < 35) {
      return {
        status: "critical",
        message: `Only ${available} credits remaining (< 5 minutes). Operations may fail.`,
        color: "red",
      };
    } else if (available < 120) {
      return {
        status: "low",
        message: `${available} credits remaining (< 15 minutes). Consider purchasing more.`,
        color: "yellow",
      };
    } else if (available < 250) {
      return {
        status: "healthy",
        message: `${available} credits available (~${Math.floor((available / 246) * 30)} minutes)`,
        color: "green",
      };
    } else {
      return {
        status: "healthy",
        message: `${available} credits available (30+ minutes)`,
        color: "green",
      };
    }
  }, [creditBalance]);

  return {
    creditStatus: creditBalance,
    isChecking,
    estimateConversationCost,
    estimateChatCost,
    canAfford,
    getCreditStatusMessage,
    refetchCreditStatus: refetchCreditBalance,
  };
}
