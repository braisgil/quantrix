"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, FolderOpen, MessageSquare } from "lucide-react";
import { MAX_FREE_AGENTS, MAX_FREE_SESSIONS, MAX_FREE_CONVERSATIONS } from "@/constants/premium";
import type { UpgradeHeaderProps } from "../../types";
import { getPlanDisplayName, isFreePlan } from "../../utils";

export const UpgradeHeader = ({ hasSubscription, onManageSubscription, currentPlanName }: UpgradeHeaderProps) => {
  const planDisplayName = getPlanDisplayName(currentPlanName);
  const isFree = isFreePlan(currentPlanName);
  
  return (
    <div>
      <Card className="matrix-card py-0 bg-muted/50 border-primary/20 hover:matrix-border transition-all">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="matrix-border text-xs">Subscription</Badge>
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  Your current plan is <span className="font-medium text-foreground">{planDisplayName}</span>
                </div>
                {isFree && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
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
            </div>
            {hasSubscription && (
              <Button onClick={onManageSubscription} variant="outline" size="sm" className="h-8 sm:h-9 matrix-border">
                Manage subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
