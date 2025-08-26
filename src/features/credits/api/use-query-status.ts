import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useQueryCreditStatus = () => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.credits.getStatus.queryOptions(),
    staleTime: 60 * 1000,
  });
};

export const useQueryCreditStatusNonSuspense = () => {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.credits.getStatus.queryOptions(),
    staleTime: 60 * 1000,
  });
};


