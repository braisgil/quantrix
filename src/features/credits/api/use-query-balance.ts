import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useQueryCreditBalance = () => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.credits.getBalance.queryOptions(),
    staleTime: 60 * 1000, // cache balance for 60s; callers can refetch on-demand
  });
};

// Non-Suspense variant for places like the navbar where Suspense isn't used
export const useQueryCreditBalanceNonSuspense = () => {
  const trpc = useTRPC();
  
  return useQuery({
    ...trpc.credits.getBalance.queryOptions(),
    staleTime: 60 * 1000, // cache balance for 60s; callers can refetch on-demand
  });
};

