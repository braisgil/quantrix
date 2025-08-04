import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export const useQueryAgent = (id: string) => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.agents.getOne.queryOptions({ id }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};