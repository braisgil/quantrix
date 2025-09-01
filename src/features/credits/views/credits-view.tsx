"use client";

import React from 'react';
import { useQueryProducts } from '@/features/premium/api';
import { ProductView } from '@/features/shared';

const CreditsView: React.FC = () => {
  const { data: products } = useQueryProducts();

  return (
    <ProductView
      type="credit"
      products={products}
      title="Credits"
      subtitle="Manage your subscription, credits, and billing preferences"
    />
  );
};

export default CreditsView;
