import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export const useQueryCall = (id: string) => {
  const trpc = useTRPC();
  
  return useSuspenseQuery(trpc.conversations.getOne.queryOptions({ id }));
}; 