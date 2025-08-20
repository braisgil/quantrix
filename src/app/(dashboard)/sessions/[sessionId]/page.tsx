import { SessionDetailView } from "@/features/sessions/views/session-detail-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ConversationSkeleton } from "@/features/conversations/components/shared/conversation-skeleton";

interface SessionDetailPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { sessionId } = await params;
  const queryClient = getQueryClient();

  // Try to prefetch session data on the server for optimal performance
  try {
    await queryClient.prefetchQuery(
      trpc.sessions.getOne.queryOptions({ id: sessionId })
    );
    await queryClient.prefetchQuery(
      trpc.sessions.getSessionConversations.queryOptions({ sessionId })
    );
    await queryClient.prefetchQuery(
      trpc.premium.getUsageAndLimits.queryOptions()
    );
  } catch {
    // Prefetch failed - client will handle it gracefully
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ConversationSkeleton variant="detail-view" />}>
        <SessionDetailView sessionId={sessionId} />
      </Suspense>
    </HydrationBoundary>
  );
}