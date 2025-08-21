"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useConfirmCreditPurchase } from "@/features/credits/api";

export default function CreditPurchaseSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const checkoutId = searchParams.get("session_id");
  const confirm = useConfirmCreditPurchase();

  // Use a query to manage the confirmation state - this persists across remounts
  const { data: confirmationState, refetch } = useQuery({
    queryKey: ['creditPurchaseConfirmation', checkoutId],
    queryFn: async () => {
      if (!checkoutId) throw new Error("No checkout ID");
      
      // Check if we've already processed this
      const cached = sessionStorage.getItem(`credit-confirm-${checkoutId}`);
      if (cached) {
        return JSON.parse(cached);
      }
      
      // If not cached, we need to trigger the mutation
      return { status: 'pending' };
    },
    enabled: !!checkoutId,
    staleTime: Infinity,
  });

  // Trigger the mutation when we have a pending state
  useEffect(() => {
    if (checkoutId && confirmationState?.status === 'pending' && !confirm.isPending && !confirm.data && !confirm.isError) {
      confirm.mutate({ checkoutId });
    }
  }, [confirmationState, checkoutId, confirm]);

  // Update the cached state when mutation completes
  useEffect(() => {
    if (checkoutId && (confirm.isSuccess || confirm.isError)) {
      const state = {
        status: confirm.isSuccess ? 'success' : 'error',
        data: confirm.data,
        error: confirm.error?.message,
      };
      sessionStorage.setItem(`credit-confirm-${checkoutId}`, JSON.stringify(state));
      refetch();
    }
  }, [confirm.isSuccess, confirm.isError, confirm.data, confirm.error, checkoutId, refetch]);

  const handleContinue = () => {
    // Clean up sessionStorage
    if (checkoutId) {
      sessionStorage.removeItem(`credit-confirm-${checkoutId}`);
    }
    router.push("/credits");
  };

  const handleGoToDashboard = () => {
    // Clean up sessionStorage
    if (checkoutId) {
      sessionStorage.removeItem(`credit-confirm-${checkoutId}`);
    }
    router.push("/overview");
  };

  const handleRetry = () => {
    // Clean up and retry
    if (checkoutId) {
      sessionStorage.removeItem(`credit-confirm-${checkoutId}`);
    }
    confirm.reset();
    refetch();
  };

  if (!checkoutId) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Invalid Purchase Session</CardTitle>
            <CardDescription className="text-center">
              No checkout session found. Please try purchasing credits again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/credits")} className="w-full">
              Return to Credits
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while mutation is pending or state is pending
  if (confirm.isPending || confirmationState?.status === 'pending') {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
            <CardTitle className="text-center">Processing Purchase</CardTitle>
            <CardDescription className="text-center">
              Please wait while we confirm your credit purchase...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show error state
  if (confirm.isError || confirmationState?.status === 'error') {
    const errorMessage = confirm.error?.message || confirmationState?.error || "There was an error processing your purchase. Please contact support.";
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-destructive/10">
                <XCircle className="size-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-center">Purchase Failed</CardTitle>
            <CardDescription className="text-center">
              {errorMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleRetry} 
              className="w-full" 
              variant="outline"
            >
              Retry
            </Button>
            <Button onClick={() => router.push("/credits")} className="w-full">
              Return to Credits
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show success state
  if (confirm.isSuccess || confirmationState?.status === 'success') {
    const resultData = confirm.data || confirmationState?.data;
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-center">Purchase Successful!</CardTitle>
            <CardDescription className="text-center">
              {resultData && 'alreadyProcessed' in resultData && resultData.alreadyProcessed 
                ? "This purchase has already been processed."
                : `${resultData && 'creditsAdded' in resultData ? resultData.creditsAdded : 0} credits have been added to your account.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleContinue} className="w-full">
              View Credits
            </Button>
            <Button onClick={handleGoToDashboard} variant="outline" className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}