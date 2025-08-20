"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

import type { PricingCardProps } from "../../types";
import { 
  getProductIcon, 
  getBenefitIcon, 
  formatPrice, 
  isProductHighlighted, 
  getProductAction 
} from "../../utils";
import { FeatureItem } from "../shared";

export const PricingCard = ({ product, currentSubscription }: PricingCardProps) => {
  const isHighlighted = isProductHighlighted(product);
  const Icon = getProductIcon(isHighlighted);
  const price = formatPrice(product);

  const { buttonText, onClick } = getProductAction(
    product,
    currentSubscription,
    (productId) => authClient.checkout({ products: [productId] }),
    () => authClient.customer.portal()
  );

  return (
    <Card className={`relative ${isHighlighted ? "matrix-glow" : ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="size-5 text-primary" />
            </div>
            <CardTitle className="text-xl">{product.name}</CardTitle>
          </div>
          {isHighlighted && (
            <Badge className="bg-primary text-primary-foreground">Most popular</Badge>
          )}
        </div>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{price}</span>
          </div>

          <Separator className="bg-primary/20" />

          <ul className="space-y-3">
            {product.benefits.map((benefit) => (
              <FeatureItem 
                key={benefit.id} 
                label={benefit.description} 
                icon={getBenefitIcon(benefit.description)} 
              />
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={isHighlighted ? "default" : "outline"} 
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};
