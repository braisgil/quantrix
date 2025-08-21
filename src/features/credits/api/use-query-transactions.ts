import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useQueryCreditTransactions = (options?: {
  limit?: number;
  offset?: number;
  type?: "purchase" | "usage" | "refund" | "adjustment" | "expiration";
}) => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.credits.getTransactionHistory.queryOptions({
      limit: options?.limit ?? 50,
      offset: options?.offset ?? 0,
      type: options?.type,
    }),
    staleTime: 30 * 1000, // 30 seconds
  });
};

