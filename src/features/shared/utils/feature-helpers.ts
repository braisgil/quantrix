import type { ProductFeature, PremiumProduct } from "../types";

/**
 * Generate credit-specific features with usage estimates
 */
export const generateCreditFeatures = (product: PremiumProduct): ProductFeature[] => {

  const { credits, callMinutes, messages, processingSessions } = product.metadata;
  
  const features: ProductFeature[] = [];

  features.push(
    {
      id: 'base-credits',
      description: `${credits.toLocaleString()} credits included`,
      icon: 'coins'
    },
    {
      id: 'call-minutes',
      description: `~${callMinutes} call minutes`,
      icon: 'phone'
    },
    {
      id: 'messages',
      description: `~${messages} messages`,
      icon: 'message'
    },
    {
      id: 'processing',
      description: `~${processingSessions} processing sessions`,
      icon: 'cpu'
    }
  );
  
  return features;
};

/**
 * Generate subscription features directly from benefits
 */
export const generateSubscriptionFeatures = (product: PremiumProduct): ProductFeature[] => {
  return product.benefits.map(benefit => ({
    id: benefit.id,
    description: benefit.description
  }));
};
