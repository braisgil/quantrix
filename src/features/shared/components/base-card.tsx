"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Phone, 
  MessageSquare, 
  Cpu,
  Crown,
  Gem,
  Bot,
  Coins
} from "lucide-react";
import type { BaseCardProps, ProductFeature } from "../types";

const getFeatureIcon = (description: string, iconOverride?: string) => {
  if (iconOverride) {
    // Map string icon names to components if needed
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'coins': Coins,
      'zap': Zap,
      'phone': Phone,
      'message': MessageSquare,
      'cpu': Cpu,
      'bot': Bot,
      'check': CheckCircle2
    };
    return iconMap[iconOverride] || CheckCircle2;
  }

  const desc = description.toLowerCase();
  if (desc.includes("credit") || desc.includes("coin")) return Coins;
  if (desc.includes("bonus") || desc.includes("extra")) return Zap;
  if (desc.includes("call") || desc.includes("phone") || desc.includes("minute")) return Phone;
  if (desc.includes("message") || desc.includes("conversation") || desc.includes("chat")) return MessageSquare;
  if (desc.includes("process") || desc.includes("ai") || desc.includes("session")) return Cpu;
  if (desc.includes("agent") || desc.includes("bot")) return Bot;
  return CheckCircle2;
};

const getProductIcon = (isHighlighted: boolean) => {
  return isHighlighted ? Crown : Gem;
};

export const BaseCard: React.FC<BaseCardProps> = ({
  data,
  onAction,
  isLoading = false,
  currentSubscription: _currentSubscription
}) => {
  const isHighlighted = data.isPopular || false;
  const Icon = getProductIcon(isHighlighted);

  return (
    <Card className={cn(
      "relative flex flex-col matrix-card border-primary/20 backdrop-blur-md transition-all duration-300 hover:matrix-border",
      isHighlighted && "matrix-glow ring-2 ring-primary shadow-lg"
    )}>
      {/* Popular Badge */}
      {isHighlighted && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1 bg-primary text-primary-foreground shadow-lg">
          <Sparkles className="size-3" />
          Most Popular
        </Badge>
      )}

      {/* Header Section */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg matrix-border">
              <Icon className="size-5 text-primary" />
            </div>
            <CardTitle className="text-xl">{data.name}</CardTitle>
          </div>
          {data.badgeText && (
            <Badge 
              variant={data.badgeVariant || "secondary"} 
              className="gap-1 bg-primary/10 text-primary border-primary/30"
            >
              <Zap className="size-3" />
              {data.badgeText}
            </Badge>
          )}
        </div>
        {data.description && (
          <p className="text-sm text-muted-foreground mt-2">{data.description}</p>
        )}
      </CardHeader>

      {/* Content Section */}
      <CardContent className="flex-1 space-y-4">
        {/* Price Section */}
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{data.price}</span>
            <span className="text-muted-foreground text-sm">
              {data.variant === "credit" ? "USD" : ""}
            </span>
          </div>
        </div>

        <Separator className="bg-primary/20" />

        {/* Features Section */}
        <div className="space-y-3 flex-1">
          {data.features.map((feature: ProductFeature) => {
            const FeatureIcon = getFeatureIcon(feature.description, feature.icon);
            return (
              <div key={feature.id} className="flex items-center gap-2">
                <FeatureIcon className="size-4 text-primary flex-shrink-0" />
                <span className="text-sm">{feature.description}</span>
              </div>
            );
          })}
        </div>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="pt-4">
        <Button 
          className="w-full matrix-button" 
          variant={isHighlighted ? "default" : "outline"}
          onClick={onAction}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : (data.buttonText || "Get Started")}
        </Button>
      </CardFooter>
    </Card>
  );
};
