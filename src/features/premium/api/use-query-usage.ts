import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useQueryUsage = () => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.premium.getUsageAndLimits.queryOptions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

