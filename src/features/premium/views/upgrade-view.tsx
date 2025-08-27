"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { useQueryProducts, useQueryCurrentSubscription } from "../api";
import { UpgradeHeader, UpgradeFooter, PricingGrid } from "../components";

export const UpgradeView = () => {
  const { data: products } = useQueryProducts();
  const { data: currentSubscription } = useQueryCurrentSubscription();

  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-10">
      <UpgradeHeader
        hasSubscription={!!currentSubscription}
        onManageSubscription={() => authClient.customer.portal()}
        currentPlanName={currentSubscription?.name}
      />

      <PricingGrid products={products} currentSubscription={currentSubscription} />

      <UpgradeFooter />
    </div>
  );
};




