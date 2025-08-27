import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useQueryCreditsBalance = () => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.credits.getBalance.queryOptions(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useQueryCreditTransactions = () => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.credits.getTransactions.queryOptions(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useQueryCreditProducts = () => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.credits.getCreditProducts.queryOptions(),
    staleTime: 5 * 60 * 1000,
  });
};


