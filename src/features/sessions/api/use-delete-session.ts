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
          trpc.sessions.getMany.queryOptions({})
        );
        toast.success('Session deleted successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete session');
      },
    }),
  });
};


