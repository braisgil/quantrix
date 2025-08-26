import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/trpc/server';
import { trpc } from '@/trpc/server';
import { CreditsView } from '@/features/credits/views';
import { CreditBalanceCardSkeleton, CreditUsageChartSkeleton } from '@/features/credits/components/skeletons';

export default async function CreditsPage() {
  const queryClient = getQueryClient();

  // Try to prefetch credits data on the server for optimal performance
  try {
    await queryClient.prefetchQuery(
      trpc.credits.getBalance.queryOptions()
    );
    await queryClient.prefetchQuery(
      trpc.credits.getCreditPackages.queryOptions()
    );
    await queryClient.prefetchQuery(
      trpc.credits.getUsageStats.queryOptions({ period: "month" })
    );
    await queryClient.prefetchQuery(
      trpc.credits.getTransactionHistory.queryOptions({ limit: 50, offset: 0 })
    );
  } catch {
    // Prefetch failed - client will handle it gracefully
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<CreditsSkeleton />}>
        <CreditsView />
      </Suspense>
    </HydrationBoundary>
  );
}

function CreditsSkeleton() {
  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Credits</h1>
        <p className="text-muted-foreground">Manage your credits and view usage statistics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <CreditBalanceCardSkeleton />
        </div>
        <div className="md:col-span-2">
          <CreditUsageChartSkeleton />
        </div>
      </div>
    </div>
  );
}
