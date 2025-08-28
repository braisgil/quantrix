import React, { Suspense } from 'react';
import { HydrationBoundary } from '@tanstack/react-query';
import { dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/trpc/server';
import { trpc } from '@/trpc/server';
import { AccountView, AccountViewSkeleton } from '@/features/account';

const AccountPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch all necessary data for both credits and premium features
  try {
    // Credits data
    await queryClient.prefetchQuery(
      trpc.credits.getBalance.queryOptions()
    );
    await queryClient.prefetchQuery(
      trpc.credits.getTransactions.queryOptions()
    );
    
    // Premium data
    await queryClient.prefetchQuery(
      trpc.premium.getProducts.queryOptions()
    );
    await queryClient.prefetchQuery(
      trpc.premium.getCurrentSubscription.queryOptions()
    );
  } catch {
    // Prefetch failed - client will handle it gracefully
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AccountViewSkeleton />}>
        <AccountView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default AccountPage;
