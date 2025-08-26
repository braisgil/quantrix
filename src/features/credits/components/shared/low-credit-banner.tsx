"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShoppingCart } from "lucide-react";
import { useQueryCreditBalanceNonSuspense } from "../../api";
import { cn } from "@/lib/utils";

interface LowCreditBannerProps {
  threshold?: number;
  onPurchaseClick?: () => void;
  className?: string;
  variant?: "warning" | "critical";
}

export const LowCreditBanner = ({ 
  threshold = 100, 
  onPurchaseClick,
  className,
  variant = "warning"
}: LowCreditBannerProps) => {
  const { data: balance } = useQueryCreditBalanceNonSuspense();

  if (!balance || balance.availableCredits >= threshold) {
    return null;
  }

  const isCritical = balance.availableCredits < 50;
  const currentVariant = isCritical ? "critical" : variant;
  
  const getMessage = () => {
    if (isCritical) {
      return `Critical: Only ${balance.availableCredits.toFixed(0)} credits remaining. Purchase more to continue using AI services.`;
    }
    return `Low balance: You have ${balance.availableCredits.toFixed(0)} credits remaining. Consider purchasing more soon.`;
  };

  return (
    <Alert 
      variant={currentVariant === "critical" ? "destructive" : "default"}
      className={cn(
        "border-l-4",
        currentVariant === "critical" 
          ? "border-l-destructive bg-destructive/5" 
          : "border-l-orange-500 bg-orange-50 dark:bg-orange-950/20",
        className
      )}
    >
      <AlertTriangle className="size-4" />
      <AlertDescription className="flex items-center justify-between">
        <span className="flex-1">
          {getMessage()}
        </span>
        {onPurchaseClick && (
          <Button
            onClick={onPurchaseClick}
            size="sm"
            variant={currentVariant === "critical" ? "destructive" : "outline"}
            className="ml-3 gap-1.5"
          >
            <ShoppingCart className="size-3.5" />
            Buy Credits
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
