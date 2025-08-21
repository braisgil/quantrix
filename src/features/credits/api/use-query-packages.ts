import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useQueryCreditPackages = () => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.credits.getCreditPackages.queryOptions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

