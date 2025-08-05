import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/trpc/server';
import { trpc } from '@/trpc/server';
import { ConversationListView } from '@/features/conversations/views';
import { ConversationSkeleton } from '@/features/conversations/components/shared/conversation-skeleton';

export default async function ConversationsPage() {
  const queryClient = getQueryClient();

  // Try to prefetch conversations data on the server for optimal performance
  try {
    await queryClient.prefetchQuery(
      trpc.conversations.getMany.queryOptions({})
    );
  } catch {
    // Prefetch failed - client will handle it gracefully
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ConversationSkeleton variant="list-item" />}>
        <ConversationListView />
      </Suspense>
    </HydrationBoundary>
  );
}
