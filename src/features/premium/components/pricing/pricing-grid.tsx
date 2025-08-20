"use client";

import React from "react";
import type { PremiumProducts, PremiumSubscription } from "../../types";
import { PricingCard } from "./pricing-card";

interface PricingGridProps {
  products: PremiumProducts;
  currentSubscription: PremiumSubscription;
}

export const PricingGrid = ({ products, currentSubscription }: PricingGridProps) => {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {products.map((product) => (
        <PricingCard
          key={product.id}
          product={product}
          currentSubscription={currentSubscription}
        />
      ))}
    </section>
  );
};
