import { useTRPC } from "@/trpc/client";
import { ConversationStatus } from "@/features/conversations/types";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useQuerySessionConversations = (params?: {
  search?: string;
  agentId?: string;
  status?: ConversationStatus;
}) => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.conversations.getMany.queryOptions(params || {}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};