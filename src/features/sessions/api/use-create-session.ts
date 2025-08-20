import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { toast } from 'sonner';

export const useCreateSession = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.sessions.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.sessions.getMany.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.premium.getUsageAndLimits.queryOptions()
        );
        toast.success('Your session has been created successfully!');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create your session');
      },
    }),
  });
};


