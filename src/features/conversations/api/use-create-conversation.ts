import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { toast } from 'sonner';

export const useCreateConversation = (options?: { sessionId?: string }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const sessionId = options?.sessionId;

  return useMutation({
    ...trpc.conversations.create.mutationOptions({
      onSuccess: async (_, variables) => {
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
          trpc.premium.getUsageAndLimits.queryOptions()
        );
        const isScheduled = Boolean((variables as { scheduledDateTime?: unknown } | undefined)?.scheduledDateTime);
        toast.success(
          isScheduled
            ? 'Your conversation has been scheduled successfully!'
            : 'Your conversation is available now!'
        );
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create your conversation');
      },
    }),
  });
};


