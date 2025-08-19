// Public API for premium feature - provides clean interface for external consumers

// Main views (most common use case)
export { UpgradeView, UpgradeViewLoading } from './views';

// Public types
export type { 
  PremiumProducts, 
  PremiumProduct, 
  PremiumSubscription, 
  PremiumUsage,
  UpgradeHeaderProps,
  PricingCardProps,
  FeatureItemProps 
} from './types';

// Server exports for app router
export { premiumRouter } from './server/procedures';
