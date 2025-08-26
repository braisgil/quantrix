"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { CheckCircle2, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useQueryCreditPackages } from "../../api";
import { useInitiateCreditPurchase } from "../../api";
import { cn } from "@/lib/utils";
import { CreditPackagesSkeleton } from "../skeletons";

interface CreditPackagesProps {
  className?: string;
  columns?: 2 | 3 | 4;
}

export const CreditPackages = ({ className, columns = 3 }: CreditPackagesProps) => {
  const { data: packages, isLoading } = useQueryCreditPackages();
  const initiate = useInitiateCreditPurchase();

  if (isLoading) {
    return <CreditPackagesSkeleton columns={columns} />;
  }

  if (!packages || packages.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center text-center gap-3 p-6 border rounded-lg bg-muted/30", className)}>
        <div className="text-lg font-semibold">No credit packages available</div>
        <div className="text-sm text-muted-foreground">Please try again later or contact support.</div>
      </div>
    );
  }

  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn(`grid ${gridCols[columns]} gap-4`, className)}>
      {packages?.map((pkg, index) => (
        <CreditPackageCard
          key={pkg.id}
          package={pkg}
          onPurchase={() => initiate.mutate({ packageId: pkg.id })}
          isPurchasing={initiate.isPending}
          isPopular={index === 1} // Mark second package as popular
        />
      ))}
    </div>
  );
};

interface CreditPackageCardProps {
  package: {
    id: string;
    credits: number;
    bonusCredits: number;
    totalCredits: number;
    price: number;
    name: string;
    description?: string | null;
    pricePerCredit: string;
  };
  onPurchase: () => void;
  isPurchasing?: boolean;
  isPopular?: boolean;
}

const CreditPackageCard = ({ 
  package: pkg, 
  onPurchase, 
  isPurchasing,
  isPopular 
}: CreditPackageCardProps) => {
  const savings = pkg.bonusCredits > 0 
    ? Math.round((pkg.bonusCredits / pkg.credits) * 100)
    : 0;

  return (
    <Card className={cn(
      "relative flex flex-col",
      isPopular && "ring-2 ring-primary shadow-lg"
    )}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1">
          <Sparkles className="size-3" />
          Most Popular
        </Badge>
      )}

      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{pkg.name}</span>
          {savings > 0 && (
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="size-3" />
              {savings}% bonus
            </Badge>
          )}
        </CardTitle>
        {pkg.description && (
          <CardDescription>{pkg.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">${pkg.price}</span>
            <span className="text-muted-foreground">USD</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              <span className="text-sm">
                {pkg.credits.toLocaleString()} credits
              </span>
            </div>
            {pkg.bonusCredits > 0 && (
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  +{pkg.bonusCredits.toLocaleString()} bonus credits
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total credits</span>
            <span className="font-semibold">{pkg.totalCredits.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Price per credit</span>
            <span className="font-medium">${pkg.pricePerCredit}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onPurchase}
          disabled={isPurchasing}
          variant={isPopular ? "default" : "outline"}
        >
          Purchase Package
        </Button>
      </CardFooter>
    </Card>
  );
};



