import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { CREDITS_CONFIG } from "@/constants/credits";
import { useCallback } from "react";
import { useCreditBalanceSubscription } from "@/hooks/use-credit-balance-subscription";

/**
 * Hook to query user's credit balance with real-time updates
 */
export const useQueryCreditsBalance = () => {
  const trpc = useTRPC();
  
  const query = useSuspenseQuery({
    ...trpc.credits.getBalance.queryOptions(),
    // Optimized for real-time updates - minimal polling/refetching
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: CREDITS_CONFIG.QUERY_STALE_TIME,
  });

  const handleBalanceUpdate = useCallback(() => {
    query.refetch();
  }, [query]);

  // Subscribe to real-time credit balance updates via Stream Chat
  useCreditBalanceSubscription(handleBalanceUpdate);

  return query;
};

/**
 * Hook to query user's credit transaction history
 */
export const useQueryCreditTransactions = () => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.credits.getTransactions.queryOptions(),
    staleTime: CREDITS_CONFIG.QUERY_STALE_TIME,
  });
};

/**
 * Hook to query available credit products/packages
 */
export const useQueryCreditProducts = () => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.credits.getCreditProducts.queryOptions(),
    staleTime: CREDITS_CONFIG.QUERY_STALE_TIME,
  });
};

// Note: Credit deduction mutations are called server-side via webhooks
// They automatically send real-time notifications to update the balance
