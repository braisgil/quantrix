"use client";

import React from "react";
import { useQueryProducts, useQueryCurrentSubscription } from "../api";
import { PricingGrid } from "../components";

export const UpgradeView = () => {
  const { data: products } = useQueryProducts();
  const { data: currentSubscription } = useQueryCurrentSubscription();


  return (
    <div className="flex-1 flex flex-col gap-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-bold quantrix-gradient matrix-text-glow">
            Subscription
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription and billing preferences
          </p>
        </div>
      </div>

      <PricingGrid products={products} currentSubscription={currentSubscription} />

    </div>
  );
};

export const UpgradeViewLoading = () => {
  return (
    <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
      Loading…
    </div>
  );
};


