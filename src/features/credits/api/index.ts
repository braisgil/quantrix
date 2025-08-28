import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { CREDITS_CONFIG } from "@/constants/credits";

/**
 * Hook to query user's credit balance
 */
export const useQueryCreditsBalance = () => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.credits.getBalance.queryOptions(),
    staleTime: CREDITS_CONFIG.QUERY_STALE_TIME,
  });
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
