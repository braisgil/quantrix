import type { PremiumProduct } from "../types";

/**
 * Format price for display
 */
export const formatPrice = (product: PremiumProduct): string => {
  const price =
    product.prices[0].amountType === "fixed"
      ? product.prices[0].priceAmount / 100
      : 0;

  return Intl.NumberFormat("en-US", { 
          style: "currency", 
          currency: "USD", 
          minimumFractionDigits: 0 
        }).format(price);
};

/**
 * Determine if a product is highlighted based on metadata
 */
export const isProductHighlighted = (product: PremiumProduct): boolean => {
  return product.metadata.variant === "highlighted";
};

