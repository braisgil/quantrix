import type { PremiumProduct } from "@/features/premium/types";

/**
 * Extract credit information from product metadata
 */
export const extractCreditData = (product: PremiumProduct) => {
  const credits = Number(product.metadata?.credits ?? 0);
  const bonusCredits = Number(product.metadata?.bonus ?? 0);
  const totalCredits = credits + bonusCredits;

  // Calculate usage estimates based on credit amounts
  const callMinutes = Math.floor(totalCredits / 50);
  const messages = Math.floor(totalCredits / 10);
  const processingSessions = Math.floor(totalCredits / 100);

  return {
    credits,
    bonusCredits,
    totalCredits,
    callMinutes,
    messages,
    processingSessions,
  } as const;
};

/**
 * Filter products by type
 */
export const filterProductsByType = (
  products: PremiumProduct[], 
  type: 'credit' | 'subscription'
): PremiumProduct[] => {
  return products.filter(product => 
    type === 'credit' ? !product.isRecurring : product.isRecurring
  );
};
