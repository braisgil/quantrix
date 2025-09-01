"use client";

import React from "react";
import { useQueryProducts, useQueryCurrentSubscription } from "../api";
import { ProductView } from "@/features/shared";

export const UpgradeView = () => {
  const { data: products } = useQueryProducts();
  const { data: currentSubscription } = useQueryCurrentSubscription();

  return (
    <ProductView
      type="subscription"
      products={products}
      currentSubscription={currentSubscription}
      title="Subscription"
      subtitle="Manage your subscription and billing preferences"
    />
  );
};

export const UpgradeViewLoading = () => {
  return (
    <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
      Loading…
    </div>
  );
};


