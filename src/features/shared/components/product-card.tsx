"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { BaseCard } from "./base-card";
import type { ProductCardProps } from "../types";
import { formatPrice, isProductHighlighted } from "@/features/premium/utils";
import { 
  generateCreditFeatures, 
  generateSubscriptionFeatures
} from "../utils";

// Component logic moved to utils following project patterns

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentSubscription,
  isPopular,
  isLoading = false
}) => {
  // Generate features using utils
  const features = product.isRecurring 
    ? generateSubscriptionFeatures(product)
    : generateCreditFeatures(product);

  // Handle purchase/subscription action
  const handleAction = React.useCallback(async () => {
    try {
      if (product.isRecurring && currentSubscription) {
        // If user has subscription, redirect to customer portal
        await authClient.customer.portal();
      } else {
        // Direct purchase/checkout
        await authClient.checkout({ products: [product.id] });
      }
    } catch (error) {
      console.error('Failed to handle product action:', error);
    }
  }, [product, currentSubscription]);

  return (
    <BaseCard
      data={{
        id: product.id,
        name: product.name,
        description: product.description,
        price: formatPrice(product),
        features,
        isPopular: isPopular || isProductHighlighted(product),
        variant: product.isRecurring ? "subscription" : "credit",
        buttonText: product.isRecurring ? undefined : 'Purchase Package',
      }}
      onAction={handleAction}
      isLoading={isLoading}
      currentSubscription={currentSubscription}
    />
  );
};
