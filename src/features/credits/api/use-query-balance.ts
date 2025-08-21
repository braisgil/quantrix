import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useQueryCreditBalance = () => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.credits.getBalance.queryOptions(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Non-Suspense variant for places like the navbar where Suspense isn't used
export const useQueryCreditBalanceNonSuspense = () => {
  const trpc = useTRPC();
  
  return useQuery({
    ...trpc.credits.getBalance.queryOptions(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

