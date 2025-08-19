import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

// Unified, standardized types inferred from tRPC router
export type PremiumProducts = inferRouterOutputs<AppRouter>["premium"]["getProducts"];
export type PremiumProduct = PremiumProducts[number];
export type PremiumSubscription = inferRouterOutputs<AppRouter>["premium"]["getCurrentSubscription"];
export type PremiumUsage = inferRouterOutputs<AppRouter>["premium"]["getUsage"];

// Component prop types
export interface UpgradeHeaderProps {
  hasSubscription: boolean;
  onManageSubscription: () => void;
  currentPlanName?: string | null;
}

export interface PricingCardProps {
  product: PremiumProduct;
  currentSubscription: PremiumSubscription;
}

export interface FeatureItemProps {
  label: string;
  icon: React.ElementType;
}
