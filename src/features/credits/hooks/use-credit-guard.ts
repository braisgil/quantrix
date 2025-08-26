"use client";

import { useQueryCreditBalanceNonSuspense } from "../api";
import { CreditService } from "@/lib/credits/simple-credit-service";
import { useCallback } from "react";

interface CreditGuardOptions {
  /** Minimum credits required for the operation */
  requiredCredits?: number;
  /** Show a warning when credits are below this threshold */
  warningThreshold?: number;
  /** Custom error message */
  errorMessage?: string;
}

interface CreditGuardResult {
  /** Whether user has sufficient credits */
  canAfford: boolean;
  /** Whether user should be warned about low balance */
  shouldWarn: boolean;
  /** Current available credits */
  availableCredits: number;
  /** Check if user can afford a specific amount */
  checkAmount: (amount: number) => boolean;
  /** Estimate cost for OpenAI operation */
  estimateOpenAICost: (params: {
    model: "gpt-4o" | "gpt-4o-mini";
    estimatedInputTokens: number;
    estimatedOutputTokens: number;
  }) => Promise<{ canAfford: boolean; estimatedCost: number }>;
  /** Refresh balance data */
  refreshBalance: () => void;
}

export const useCreditGuard = (options: CreditGuardOptions = {}): CreditGuardResult => {
  const {
    requiredCredits = 0,
    warningThreshold = 100,
  } = options;

  const { data: balance, refetch } = useQueryCreditBalanceNonSuspense();
  const availableCredits = balance?.availableCredits || 0;

  const canAfford = availableCredits >= requiredCredits;
  const shouldWarn = availableCredits < warningThreshold;

  const checkAmount = useCallback((amount: number): boolean => {
    return availableCredits >= amount;
  }, [availableCredits]);

  const estimateOpenAICost = useCallback(async (params: {
    model: "gpt-4o" | "gpt-4o-mini";
    estimatedInputTokens: number;
    estimatedOutputTokens: number;
  }) => {
    try {
      const costEstimate = await CreditService.estimateServiceCost(
        "openai_gpt4o", 
        params.estimatedInputTokens + params.estimatedOutputTokens
      );
      return {
        canAfford: availableCredits >= costEstimate.credits,
        estimatedCost: costEstimate.credits,
      };
    } catch (error) {
      console.error("Failed to estimate cost:", error);
      return {
        canAfford: false,
        estimatedCost: 0,
      };
    }
  }, [availableCredits]);

  const refreshBalance = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    canAfford,
    shouldWarn,
    availableCredits,
    checkAmount,
    estimateOpenAICost,
    refreshBalance,
  };
};
