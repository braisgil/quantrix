import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { toast } from 'sonner';

export const useDeleteAgent = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  return useMutation({
    ...trpc.agents.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.premium.getUsage.queryOptions()
        );
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );
        // Deleting an agent cascades to sessions and conversations
        await queryClient.invalidateQueries(
          trpc.sessions.getMany.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.conversations.getMany.queryOptions({})
        );
        toast.success("Agent deleted successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete agent");
      },
    }),
  });
};
