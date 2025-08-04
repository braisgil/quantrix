import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

/**
 * Hook for managing agents data fetching using Suspense
 * Provides better loading states and error handling through React Suspense
 */
export const useQueryAgents = (search?: string) => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.agents.getMany.queryOptions({ search }),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};