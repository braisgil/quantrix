import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useQueryProducts = () => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.premium.getProducts.queryOptions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

