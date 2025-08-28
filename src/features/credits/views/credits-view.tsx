"use client";

import React from 'react';
import { CardContent } from '@/components/ui/card';
import CreditPackage from '@/features/credits/components/credit-package';
import { authClient } from '@/lib/auth-client';
import { useQueryCreditProducts } from '@/features/credits/api';
import type { CreditPackageData } from '../types';

const CreditsView: React.FC = () => {
  const { data: creditProducts } = useQueryCreditProducts();

  const packages: CreditPackageData[] = React.useMemo(
    () => (creditProducts ?? []).map((product): CreditPackageData => {
      // Expect price fixed in cents and metadata.credits and optional metadata.bonus
      const fixedPrice = product.prices.find((p) => p.amountType === 'fixed');
      const cents = (fixedPrice && 'priceAmount' in fixedPrice) ? fixedPrice.priceAmount : 0;
      const price = cents / 100;
      
      const creditsRaw = product.metadata?.credits;
      const bonusRaw = product.metadata?.bonus;
      const credits = typeof creditsRaw === 'number' ? creditsRaw : Number(creditsRaw ?? 0);
      const bonusCredits = typeof bonusRaw === 'number' ? bonusRaw : Number(bonusRaw ?? 0);
      const totalCredits = credits + bonusCredits;

      return {
        id: product.id,
        polarProductId: product.id,
        credits,
        bonusCredits,
        totalCredits,
        price,
        name: product.name,
        description: product.description ?? null,
      };
    }),
    [creditProducts]
  );

  const handlePurchase = React.useCallback(async (polarProductId: string): Promise<void> => {
    try {
      await authClient.checkout({ products: [polarProductId] });
    } catch (error) {
      console.error('Failed to initiate checkout:', error);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-bold quantrix-gradient matrix-text-glow">
            Credits
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription, credits, and billing preferences
          </p>
        </div>
      </div>
      <CardContent className="px-0 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages?.map((pkg, index) => (
          <CreditPackage
            key={pkg.id}
            pkg={pkg}
            onPurchase={() => handlePurchase(pkg.polarProductId || pkg.id)}
            isPurchasing={false}
            isPopular={index === 1}
          />
        ))}
      </div>
      </CardContent>
    </div>
  );
};

export default CreditsView;
