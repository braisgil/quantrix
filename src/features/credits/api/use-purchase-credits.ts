import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

export const useInitiateCreditPurchase = () => {
  const trpc = useTRPC();
  
  return useMutation({
    ...trpc.credits.initiateCreditPurchase.mutationOptions({
      onSuccess: (data) => {
        // Redirect to Polar checkout
        window.location.href = data.checkoutUrl;
      },
      onError: (error) => {
        toast.error("Failed to initiate checkout", {
          description: error.message,
        });
      },
    }),
  });
};

export const useConfirmCreditPurchase = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  return useMutation({
    ...trpc.credits.confirmCreditPurchase.mutationOptions({
      onSuccess: async (data) => {
        if ('alreadyProcessed' in data && !data.alreadyProcessed) {
          const creditsAdded = 'creditsAdded' in data ? data.creditsAdded : 0;
          toast.success("Credits purchased successfully", {
            description: `${creditsAdded} credits have been added to your account`,
          });
        }
        // Invalidate queries after success
        await queryClient.invalidateQueries(
          trpc.credits.getBalance.queryOptions()
        );
        await queryClient.invalidateQueries(
          trpc.credits.getTransactionHistory.queryOptions({
            limit: 50,
            offset: 0,
          })
        );
      },
      onError: (error) => {
        toast.error("Failed to confirm purchase", {
          description: error.message,
        });
      },
    }),
  });
};
