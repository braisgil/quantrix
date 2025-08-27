import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sparkles, TrendingUp, CheckCircle2, Zap } from 'lucide-react';
import React from 'react';

interface CreditPackageProps {
  pkg: {
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

const CreditPackage: React.FC<CreditPackageProps> = ({
  pkg,
  isPopular,
  onPurchase,
  isPurchasing,
}) => {
  const savings = pkg.bonusCredits > 0 ? (pkg.bonusCredits / pkg.credits) * 100 : 0;

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

export default CreditPackage;
