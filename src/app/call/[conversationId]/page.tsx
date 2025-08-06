import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { CallView } from "@/features/call/view/call-view";
import { CallSkeleton } from "@/features/call/components";

interface CallPageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

const Page = async ({ params }: CallPageProps) => {
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
      <Suspense fallback={<CallSkeleton />}>
        <CallView conversationId={conversationId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
