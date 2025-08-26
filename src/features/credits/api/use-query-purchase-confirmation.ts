import { useQuery } from '@tanstack/react-query';

// Proper TypeScript types
export type ConfirmationResult = {
  success: boolean;
  alreadyProcessed?: boolean;
  creditsAdded?: number;
};

export type ConfirmationState = {
  status: 'pending' | 'success' | 'error';
  data?: ConfirmationResult;
  error?: string;
};

export const useQueryPurchaseConfirmation = (checkoutId: string | null) => {
  return useQuery({
    queryKey: ['creditPurchaseConfirmation', checkoutId],
    queryFn: async (): Promise<ConfirmationState> => {
      if (!checkoutId) throw new Error("No checkout ID");
      
      // Check sessionStorage for cached results
      const cached = sessionStorage.getItem(`credit-confirm-${checkoutId}`);
      if (cached) {
        try {
          return JSON.parse(cached) as ConfirmationState;
        } catch (error) {
          console.warn("Failed to parse cached confirmation state:", error);
        }
      }
      
      // If not cached, return pending state to trigger mutation
      return { status: 'pending' };
    },
    enabled: !!checkoutId,
    staleTime: Infinity, // Never refetch - this is one-time confirmation
    gcTime: Infinity, // Keep in cache forever during session
  });
};
