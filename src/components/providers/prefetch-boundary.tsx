import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/trpc/server';
import { trpc } from '@/trpc/server';

interface PrefetchBoundaryProps {
  children: React.ReactNode;
  prefetchAgents?: boolean;
  prefetchAgent?: string;
  search?: string;
}

export default async function PrefetchBoundary({ 
  children, 
  prefetchAgents = false,
  prefetchAgent,
  search
}: PrefetchBoundaryProps) {
  const queryClient = getQueryClient();

  if (prefetchAgents) {
    await queryClient.prefetchQuery(
      trpc.agents.getMany.queryOptions({ search })
    );
  }

  if (prefetchAgent) {
    try {
      await queryClient.prefetchQuery(
        trpc.agents.getOne.queryOptions({ id: prefetchAgent })
      );
    } catch {
      // Prefetch failed - continue gracefully
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}