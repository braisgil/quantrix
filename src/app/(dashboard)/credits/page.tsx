import React, { Suspense } from 'react';
import CreditsView from '@/features/credits/views/credits-view';
import { HydrationBoundary } from '@tanstack/react-query';
import { dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/trpc/server';
import { trpc } from '@/trpc/server';
import CreditsViewSkeleton from '@/features/credits/components/skeleton/credits-view-skeleton';

const CreditsPage = async () => {
  const queryClient = getQueryClient();

  // Try to prefetch credits data on the server for optimal performance
  try {
    await queryClient.prefetchQuery(
      trpc.credits.getBalance.queryOptions()
    );
    await queryClient.prefetchQuery(
      trpc.credits.getTransactions.queryOptions()
    );
  } catch {
    // Prefetch failed - client will handle it gracefully
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<CreditsViewSkeleton />}>
        <CreditsView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default CreditsPage;
