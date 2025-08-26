import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/trpc/server';
import { trpc } from '@/trpc/server';
import { CreditsView } from '@/features/credits/views';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-5 w-64" />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-40" />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="h-[360px]">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[280px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
