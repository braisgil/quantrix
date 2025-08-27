import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { UpgradeView } from "@/features/premium/components";
import { UpgradeViewLoading } from "@/features/premium/views/upgrade-view";

export default async function UpgradePage() {
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(
      trpc.premium.getProducts.queryOptions()
    );
    await queryClient.prefetchQuery(
      trpc.premium.getCurrentSubscription.queryOptions()
    );
  } catch {
    // ignore prefetch errors; client will refetch
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<UpgradeViewLoading />}> 
        <UpgradeView />
      </Suspense>
    </HydrationBoundary>
  );
}
