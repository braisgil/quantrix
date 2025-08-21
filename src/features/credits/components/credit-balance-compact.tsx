"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Coins, AlertCircle } from "lucide-react";
import { useQueryCreditBalanceNonSuspense } from "../api";
import { cn } from "@/lib/utils";

interface CreditBalanceCompactProps {
  className?: string;
  onClick?: () => void;
  showWarning?: boolean;
}

export const CreditBalanceCompact = ({ 
  className,
  onClick,
  showWarning = true
}: CreditBalanceCompactProps) => {
  const { data: balance, isLoading } = useQueryCreditBalanceNonSuspense();

  if (isLoading) {
    return <CreditBalanceCompactSkeleton />;
  }

  const isLowBalance = balance && balance.availableCredits < 100;
  const formattedBalance = balance?.availableCredits.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) || "0";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 h-9",
              isLowBalance && showWarning && "text-destructive",
              className
            )}
            onClick={onClick}
          >
            <Coins className="size-4" />
            <span className="font-medium">{formattedBalance}</span>
            {isLowBalance && showWarning && (
              <AlertCircle className="size-3.5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">Credit Balance</p>
            <p className="text-xs text-muted-foreground">
              Available: {balance?.displayAvailable || "0.00"}
            </p>
            {isLowBalance && (
              <p className="text-xs text-destructive font-medium">
                Low balance - Purchase more credits
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const CreditBalanceCompactSkeleton = () => {
  return (
    <div className="flex items-center gap-2 h-9 px-3">
      <Skeleton className="size-4 rounded-full" />
      <Skeleton className="h-4 w-12" />
    </div>
  );
};

