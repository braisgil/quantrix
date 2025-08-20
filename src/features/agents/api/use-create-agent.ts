import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { toast } from 'sonner';

export const useCreateAgent = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.premium.getUsageAndLimits.queryOptions()
        );
        toast.success('Your AI companion has been created successfully!');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create your AI companion');
      },
    }),
  });
};


