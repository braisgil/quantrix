"use client";

import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CreditPackage from '@/features/credits/components/credit-package';
import { authClient } from '@/lib/auth-client';
import { useQueryCreditsBalance, useQueryCreditProducts } from '@/features/credits/api';
import type { CreditPackageData } from '../types';

const CreditsView: React.FC = () => {
  const { data: balanceData } = useQueryCreditsBalance();
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
    <div>
      <CardHeader className="px-0 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <CardTitle className="text-lg font-bold quantrix-gradient matrix-text-glow">
            Credits
          </CardTitle>
        </div>
        <CardDescription>
          Manage your credits and track usage across all services{balanceData?.balance ? ` — Balance: ${balanceData.balance.toLocaleString()} credits` : ''}
        </CardDescription>
      </CardHeader>
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
