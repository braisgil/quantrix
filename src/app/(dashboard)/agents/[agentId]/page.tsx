import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/trpc/server';
import { trpc } from '@/trpc/server';
import { AgentDetailView } from '@/features/agents/components';
import { AgentSkeleton } from '@/features/agents/components/shared/agent-skeleton';

interface PageProps {
  params: Promise<{ agentId: string }>;
}

export default async function AgentPage({ params }: PageProps) {
  const { agentId } = await params;
  const queryClient = getQueryClient();

  // Try to prefetch agent data on the server for optimal performance
  try {
    await queryClient.prefetchQuery(
      trpc.agents.getOne.queryOptions({ id: agentId })
    );
    await queryClient.prefetchQuery(
      trpc.sessions.getMany.queryOptions({ agentId })
    );
  } catch {
    // Prefetch failed - client will handle it gracefully
  }

  return (
    <div className="space-y-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentSkeleton variant="detail" />}>
          <AgentDetailView agentId={agentId} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}