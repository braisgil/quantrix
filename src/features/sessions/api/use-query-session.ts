import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useQuerySession = (id: string) => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.sessions.getOne.queryOptions({ id }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};