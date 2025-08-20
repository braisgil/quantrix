import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useQueryCurrentSubscription = () => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.premium.getCurrentSubscription.queryOptions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

