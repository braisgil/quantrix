"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Bot, FolderOpen, MessageSquare } from "lucide-react";
import { MAX_FREE_AGENTS, MAX_FREE_SESSIONS, MAX_FREE_CONVERSATIONS } from "@/constants/premium";
import type { UpgradeHeaderProps } from "../../types";
import { getPlanDisplayName, isFreePlan } from "../../utils";

export const UpgradeHeader = ({ hasSubscription, onManageSubscription, currentPlanName }: UpgradeHeaderProps) => {
  const planDisplayName = getPlanDisplayName(currentPlanName);
  const isFree = isFreePlan(currentPlanName);
  
  return (
    <header className="relative overflow-hidden rounded-xl border matrix-border bg-background/70 p-8 md:p-10 matrix-glow">
      <div className="absolute -inset-40 -z-10 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 blur-3xl" />
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="size-4 text-primary" />
            </div>
            <Badge variant="outline" className="border-primary/40 text-primary">Subscription</Badge>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              <span className="text-foreground font-medium">Your current plan is: </span>
              <span className="text-foreground">{planDisplayName}</span>
            </h1>
            {isFree && (
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">
                  <Bot className="size-3" />
                  {MAX_FREE_AGENTS} Agent
                </Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">
                  <FolderOpen className="size-3" />
                  {MAX_FREE_SESSIONS} Session
                </Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">
                  <MessageSquare className="size-3" />
                  {MAX_FREE_CONVERSATIONS} Conversations
                </Badge>
              </div>
            )}
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Upgrade to increase your limits and access a smoother experience. Payments are handled securely by Polar.
          </p>
        </div>
        {hasSubscription && (
          <Button onClick={onManageSubscription} variant="outline" className="h-10 matrix-border">
            Manage subscription
          </Button>
        )}
      </div>
    </header>
  );
};
