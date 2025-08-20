import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient, trpc } from "@/trpc/server";
import { ConversationSkeleton } from '@/features/conversations/components/shared/conversation-skeleton';
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
      <Suspense fallback={<ConversationSkeleton variant="list-item" />}>
        <SessionListView />
      </Suspense>
    </HydrationBoundary>
  );
}