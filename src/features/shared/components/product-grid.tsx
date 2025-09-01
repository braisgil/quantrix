"use client";

import React from "react";
import { ProductCard } from "./product-card";
import type { ProductGridProps } from "../types";

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  currentSubscription 
}) => {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {products?.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          currentSubscription={currentSubscription}
          isPopular={index === 1} // Make middle item popular
        />
      ))}
    </section>
  );
};
