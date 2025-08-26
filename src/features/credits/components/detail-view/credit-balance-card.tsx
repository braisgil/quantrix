"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  Coins,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Plus
} from "lucide-react";
import { CreditBalanceCardSkeleton } from "../skeletons";
import { useQueryCreditBalance } from "../../api";
import { cn } from "@/lib/utils";

interface CreditBalanceCardProps {
  onPurchaseClick?: () => void;
  showPurchaseButton?: boolean;
  className?: string;
}

export const CreditBalanceCard = ({ 
  onPurchaseClick, 
  showPurchaseButton = true,
  className 
}: CreditBalanceCardProps) => {
  const { data: balance, isLoading } = useQueryCreditBalance();

  if (isLoading) {
    return <CreditBalanceCardSkeleton />;
  }

  // Show free vs paid usage explicitly to avoid confusing ratios
  const paidAvailable = balance?.paidAvailable ?? 0;
  const freeAvailable = balance?.freeAvailable ?? 0;
  const freeAllocation = balance?.freeAllocation ?? 0;
  const freeUsed = Math.max(0, freeAllocation - freeAvailable);
  const freePercent = freeAllocation > 0 ? (freeUsed / freeAllocation) * 100 : 0;

  const isLowBalance = balance && balance.availableCredits < 100;

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Coins className="size-4 text-primary" />
              </div>
              Credit Balance
            </CardTitle>
            <CardDescription>
              Your available credits for AI services
            </CardDescription>
          </div>
          {showPurchaseButton && (
            <Button
              onClick={onPurchaseClick}
              size="sm"
              className="gap-1.5"
            >
              <Plus className="size-3.5" />
              Buy Credits
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="space-y-1">
              <p className="text-3xl font-bold">
                {balance?.displayAvailable || "0.00"}
              </p>
              <p className="text-sm text-muted-foreground">
                Available credits
              </p>
            </div>
            {isLowBalance && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="size-3" />
                Low balance
              </Badge>
            )}
          </div>

        </div>

        {/* Free usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Monthly free usage</span>
            <span className="font-medium">
              {Math.round(freeUsed)} / {Math.round(freeAllocation)}
            </span>
          </div>
          <Progress value={freePercent} className="h-2" />
        </div>

        {/* Paid balance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Paid credits available</span>
            <span className="font-medium">
              {Math.round(paidAvailable)}
            </span>
          </div>
          <Progress value={Math.min(100, paidAvailable > 0 ? 100 : 0)} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <TrendingUp className="size-3.5 text-green-500" />
              <span>Total Purchased</span>
            </div>
            <p className="text-lg font-semibold">
              {balance?.totalPurchased.toFixed(2) || "0.00"}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <TrendingDown className="size-3.5 text-orange-500" />
              <span>Total Used</span>
            </div>
            <p className="text-lg font-semibold">
              {balance?.totalUsed.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};



