import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { toast } from 'sonner';

export const useDeleteSession = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.sessions.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.premium.getUsageAndLimits.queryOptions()
        );
        await queryClient.invalidateQueries(
          trpc.sessions.getMany.queryOptions({})
        );
        // Deleting a session may remove its conversations
        await queryClient.invalidateQueries(
          trpc.conversations.getMany.queryOptions({})
        );
        toast.success('Session deleted successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete session');
      },
    }),
  });
};


