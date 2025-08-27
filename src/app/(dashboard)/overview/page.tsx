import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient, trpc } from '@/trpc/server';
import { OverviewSkeleton } from '@/features/overview/components/skeletons';
import { OverviewView } from '@/features/overview/views';

export default async function OverviewPage() {
  const queryClient = getQueryClient();

  // Try to prefetch data for better TTFB, follow existing patterns
  try {
    await queryClient.prefetchQuery(
      trpc.agents.getMany.queryOptions({})
    );
    await queryClient.prefetchQuery(
      trpc.conversations.getMany.queryOptions({})
    );
    await queryClient.prefetchQuery(
      trpc.sessions.getMany.queryOptions({})
    );
  } catch {
    // Prefetch failed - client will fetch
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewView />
      </Suspense>
    </HydrationBoundary>
  );
}
