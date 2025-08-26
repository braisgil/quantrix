import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useEffect } from "react";
import { useQueryPurchaseConfirmation, type ConfirmationResult, type ConfirmationState } from "./use-query-purchase-confirmation";

export const useConfirmPurchaseOnce = (checkoutId: string | null) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  // Use the standard query pattern from our app
  const { data: confirmationState, refetch } = useQueryPurchaseConfirmation(checkoutId);

  const mutation = useMutation({
    ...trpc.credits.confirmCreditPurchase.mutationOptions({
      onSuccess: async (data: ConfirmationResult) => {
        const successState: ConfirmationState = {
          status: 'success',
          data,
        };
        
        if (checkoutId) {
          sessionStorage.setItem(`credit-confirm-${checkoutId}`, JSON.stringify(successState));
        }
        
        // Only show toast for new purchases, not already processed ones
        if (!data.alreadyProcessed && data.creditsAdded) {
          toast.success("Credits purchased successfully", {
            description: `${data.creditsAdded} credits have been added to your account`,
          });
        }
        
        // Invalidate relevant queries - using the standard pattern
        await queryClient.invalidateQueries(
          trpc.credits.getBalance.queryOptions()
        );
        await queryClient.invalidateQueries(
          trpc.credits.getTransactionHistory.queryOptions({
            limit: 50,
            offset: 0,
          })
        );
        
        // Update our confirmation query
        refetch();
      },
      onError: (error) => {
        const errorState: ConfirmationState = {
          status: 'error',
          error: error.message,
        };
        
        if (checkoutId) {
          sessionStorage.setItem(`credit-confirm-${checkoutId}`, JSON.stringify(errorState));
        }
        
        console.error("Credit purchase confirmation failed:", error);
        refetch();
      },
    }),
  });

  // Auto-trigger mutation when we have pending state
  useEffect(() => {
    if (checkoutId && 
        confirmationState?.status === 'pending' && 
        !mutation.isPending && 
        !mutation.data && 
        !mutation.error) {
      mutation.mutate({ checkoutId });
    }
  }, [confirmationState, checkoutId, mutation]);

  const retry = () => {
    if (checkoutId) {
      sessionStorage.removeItem(`credit-confirm-${checkoutId}`);
    }
    mutation.reset();
    refetch();
  };

  // Return the appropriate state
  return {
    isPending: mutation.isPending || confirmationState?.status === 'pending',
    isSuccess: mutation.isSuccess || confirmationState?.status === 'success',
    isError: mutation.isError || confirmationState?.status === 'error',
    data: mutation.data || confirmationState?.data,
    error: mutation.error,
    retry,
  };
};
