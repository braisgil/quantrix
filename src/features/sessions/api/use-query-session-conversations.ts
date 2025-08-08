import { useTRPC } from "@/trpc/client";
import { ConversationStatus } from "@/features/conversations/types";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useQuerySessionConversations = (params: {
  sessionId: string;
  search?: string;
  status?: ConversationStatus;
}) => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.sessions.getSessionConversations.queryOptions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};