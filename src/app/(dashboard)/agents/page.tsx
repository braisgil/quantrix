import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/trpc/server';
import { trpc } from '@/trpc/server';
import { AgentListView } from '@/features/agents/components';
import { AgentSkeleton } from '@/features/agents/components/shared/agent-skeleton';

export default async function AgentsPage() {
  const queryClient = getQueryClient();

  // Try to prefetch agents data on the server for optimal performance
  try {
    await queryClient.prefetchQuery(
      trpc.agents.getMany.queryOptions({})
    );
    await queryClient.prefetchQuery(
      trpc.premium.getUsageAndLimits.queryOptions()
    );
  } catch {
    // Prefetch failed - client will handle it gracefully
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentSkeleton variant="list" />}>
        <AgentListView />
      </Suspense>
    </HydrationBoundary>
  );
}