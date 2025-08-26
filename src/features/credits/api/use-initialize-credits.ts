import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export const useInitializeCredits = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.credits.initializeFreeCredits.mutationOptions({
      onSuccess: async (_data) => {
        // Successfully initialized free credits
        
        // Invalidate balance queries to refresh UI
        await queryClient.invalidateQueries(
          trpc.credits.getBalance.queryOptions()
        );
      },
      onError: (error) => {
        console.warn("⚠️ Failed to initialize credits (user can still use the app):", error.message);
      },
    }),
  });
};
