import { Crown, Rocket, Bot, MessageSquare, FolderOpen } from "lucide-react";
import type { PremiumProduct, PremiumSubscription } from "../types";

/**
 * Get the appropriate icon for a product based on whether it's highlighted
 */
export const getProductIcon = (isHighlighted: boolean) => {
  return isHighlighted ? Crown : Rocket;
};

/**
 * Get the appropriate icon for a benefit based on its description
 */
export const getBenefitIcon = (description: string) => {
  const lowerDescription = description.toLowerCase();
  if (lowerDescription.includes("agent")) return Bot;
  if (lowerDescription.includes("session")) return FolderOpen;
  if (lowerDescription.includes("conversation")) return MessageSquare;
  return Bot; // default icon
};

/**
 * Format price for display
 */
export const formatPrice = (product: PremiumProduct): string => {
  const price =
    product.prices[0].amountType === "fixed"
      ? product.prices[0].priceAmount / 100
      : 0;

  return price
    ? Intl.NumberFormat("en-US", { 
        style: "currency", 
        currency: "USD", 
        minimumFractionDigits: 0 
      }).format(price)
    : "Pay as You Go WIP";
};

/**
 * Determine if a product is highlighted based on metadata
 */
export const isProductHighlighted = (product: PremiumProduct): boolean => {
  return product.metadata.variant === "highlighted";
};

/**
 * Get the button text and action for a product
 */
export const getProductAction = (
  product: PremiumProduct,
  currentSubscription: PremiumSubscription,
  onCheckout: (productId: string) => void,
  onManageSubscription: () => void
) => {
  const isCurrentProduct = currentSubscription?.id === product.id;
  const isPremium = !!currentSubscription;

  let buttonText = "Upgrade";
  let onClick = () => onCheckout(product.id);

  if (isCurrentProduct) {
    buttonText = "Manage";
    onClick = onManageSubscription;
  } else if (isPremium) {
    buttonText = "Change Plan";
    onClick = onManageSubscription;
  }

  return { buttonText, onClick };
};

