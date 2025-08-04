import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export const useQueryAgents = () => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.agents.getMany.queryOptions({}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};