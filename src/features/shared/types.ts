import type { PremiumProducts, PremiumProduct, PremiumSubscription } from "@/features/premium/types";

export interface ProductCardProps {
  product: PremiumProduct;
  currentSubscription?: PremiumSubscription;
  isPopular?: boolean;
  isLoading?: boolean;
}

export interface ProductGridProps {
  products: PremiumProducts;
  currentSubscription?: PremiumSubscription;
}

export interface ProductViewProps {
  type: 'credit' | 'subscription';
  products?: PremiumProducts;
  currentSubscription?: PremiumSubscription;
  title: string;
  subtitle: string;
}

// Base card component types
export interface ProductFeature {
  id: string;
  description: string;
  icon?: string; // For manual icon override
}

export interface ProductCardData {
  id: string;
  name: string;
  description?: string | null;
  price: string | number;
  features: ProductFeature[];
  isPopular?: boolean;
  buttonText?: string;
  variant?: "subscription" | "credit";
  // Optional badge info (like savings %)
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

export interface BaseCardProps {
  data: ProductCardData;
  onAction: () => void;
  isLoading?: boolean;
  currentSubscription?: unknown;
}

// Re-export commonly used types for convenience
export type { PremiumProducts, PremiumProduct, PremiumSubscription } from "@/features/premium/types";
