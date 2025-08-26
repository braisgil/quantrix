import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient, trpc } from "@/trpc/server";
import { SessionListSkeleton } from '@/features/sessions/components/skeletons';
import { SessionListView } from '@/features/sessions/views/session-list-view';

export default async function SessionsPage() {
  const queryClient = getQueryClient();

  // Try to prefetch conversations data on the server for optimal performance
  try {
    await queryClient.prefetchQuery(
      trpc.sessions.getMany.queryOptions({})
    );
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
      <Suspense fallback={<SessionListSkeleton />}>
        <SessionListView />
      </Suspense>
    </HydrationBoundary>
  );
}