import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export const useQueryConversation = (id: string) => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.conversations.getOne.queryOptions({ id }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 