import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import type { ConversationGetOneWithAvailability } from '@/features/conversations/types';

export const useQueryCall = (id: string) => {
  const trpc = useTRPC();
  
  return useSuspenseQuery<ConversationGetOneWithAvailability>(trpc.conversations.getOne.queryOptions({ id }));
}; 