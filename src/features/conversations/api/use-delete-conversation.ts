import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { toast } from 'sonner';

export const useDeleteConversation = (options?: { sessionId?: string }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { sessionId } = options || {};
  
  return useMutation({
    ...trpc.conversations.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.premium.getUsage.queryOptions()
        );
        // Keep invalidations aligned with project patterns
        await queryClient.invalidateQueries(
          trpc.conversations.getMany.queryOptions({})
        );
        if (sessionId) {
          await queryClient.invalidateQueries(
            trpc.sessions.getSessionConversations.queryOptions({ sessionId })
          );
        }
        await queryClient.invalidateQueries(
          trpc.sessions.getMany.queryOptions({})
        );
        toast.success("Conversation deleted successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete conversation");
      },
    }),
  });
};
