"use client";

import React from "react";
import { CardContent } from "@/components/ui/card";
import { ProductGrid } from "./product-grid";
import type { ProductViewProps } from "../types";
import { filterProductsByType } from "../utils";

export const ProductView: React.FC<ProductViewProps> = ({
  type,
  products,
  currentSubscription,
  title,
  subtitle
}) => {
  // Filter products by type using utils
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    return filterProductsByType(products, type);
  }, [products, type]);

  return (
    <div className="flex-1 flex flex-col gap-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-bold quantrix-gradient matrix-text-glow">
            {title}
          </h1>
          <p className="text-muted-foreground mt-2">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <CardContent className="px-0 space-y-4">
        <ProductGrid
          products={filteredProducts}
          currentSubscription={currentSubscription}
        />
      </CardContent>
    </div>
  );
};

export const ProductViewLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
      Loading…
    </div>
  );
};
