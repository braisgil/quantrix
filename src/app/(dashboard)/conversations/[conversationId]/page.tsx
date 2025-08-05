import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/trpc/server';
import { trpc } from '@/trpc/server';
import { ConversationDetailView } from '@/features/conversations/views';
import { ConversationSkeleton } from '@/features/conversations/components/shared/conversation-skeleton';

interface ConversationPageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = await params;
  const queryClient = getQueryClient();

  // Try to prefetch conversation data on the server for optimal performance
  try {
    await queryClient.prefetchQuery(
      trpc.conversations.getOne.queryOptions({ id: conversationId })
    );
  } catch {
    // Prefetch failed - client will handle it gracefully
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ConversationSkeleton variant="detail-view" />}>
        <ConversationDetailView conversationId={conversationId} />
      </Suspense>
    </HydrationBoundary>
  );
} 