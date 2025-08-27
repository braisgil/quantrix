"use client";

import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CreditPackage from '@/features/credits/components/credit-package';
import { authClient } from '@/lib/auth-client';
import { useQueryCreditsBalance, useQueryCreditProducts } from '@/features/credits/api';
import React from 'react';

const CreditsView: React.FC = () => {
  const { data: balanceData } = useQueryCreditsBalance();
  const { data: creditProducts } = useQueryCreditProducts();

  const packages = (creditProducts ?? []).map((product) => {
    const id = product.id;
    const name = product.name;
    const description = product.description ?? '';
    // Expect price fixed in cents and metadata.credits and optional metadata.bonus
    const fixedPrice = product.prices.find((p) => p.amountType === 'fixed');
    const cents = fixedPrice && 'priceAmount' in fixedPrice ? fixedPrice.priceAmount : 0;
    const price = cents / 100;
    const creditsRaw = product.metadata?.credits;
    const bonusRaw = product.metadata?.bonus;
    const credits = typeof creditsRaw === 'number' ? creditsRaw : Number(creditsRaw ?? 0);
    const bonusCredits = typeof bonusRaw === 'number' ? bonusRaw : Number(bonusRaw ?? 0);
    const totalCredits = credits + bonusCredits;
    const pricePerCredit = totalCredits > 0 ? (price / totalCredits).toFixed(4) : '0.0000';
    return {
      id,
      polarProductId: id,
      credits,
      bonusCredits,
      totalCredits,
      price,
      name,
      description,
      pricePerCredit,
    };
  });

  const handlePurchase = async (polarProductId: string) => {
    try {
      await authClient.checkout({ products: [polarProductId] });
    } catch {}
  };

  return (
    <div>
      <CardHeader className="px-0 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <CardTitle className="text-lg font-bold quantrix-gradient matrix-text-glow">
            Credits
          </CardTitle>
        </div>
        <CardDescription>
          Manage your credits and track usage across all services{typeof balanceData?.balance === 'number' ? ` — Balance: ${balanceData.balance.toLocaleString()} credits` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages?.map((pkg, index) => (
          <CreditPackage
            key={pkg.id}
            pkg={pkg}
            onPurchase={() => handlePurchase(pkg.polarProductId)}
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
