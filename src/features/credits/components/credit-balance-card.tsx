"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Plus
} from "lucide-react";
import { useQueryCreditBalance } from "../api";
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

  const percentageUsed = balance 
    ? (balance.totalUsed / (balance.totalPurchased || 1)) * 100
    : 0;

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

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Usage</span>
            <span className="font-medium">
              {balance?.totalUsed.toFixed(2)} / {balance?.totalPurchased.toFixed(2)}
            </span>
          </div>
          <Progress value={percentageUsed} className="h-2" />
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

export const CreditBalanceCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

