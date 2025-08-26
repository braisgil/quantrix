"use client";

import Link from "next/link";
import { Zap, Brain, MessageSquare, Bot, FolderOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQueryCurrentSubscription, useQueryUsage } from "../api";
import { getUsageMetrics } from "../utils";
import { useQueryCreditBalanceNonSuspense } from "@/features/credits/api";

export const DashboardTrial = () => {
  const { data } = useQueryUsage();
  const { data: currentSubscription } = useQueryCurrentSubscription();
  const [subscriptionName = "Free", subscriptionDescription = "Limited access until you upgrade"] = currentSubscription?.name.split(" – ") ?? ["Free", "Limited access until you upgrade"];
  const usage = getUsageMetrics(data);
  const { data: creditBalance } = useQueryCreditBalanceNonSuspense();
  const freeAvailable = creditBalance?.freeAvailable ?? 0;
  const freeAllocation = creditBalance?.freeAllocation ?? 500;
  // Progress should be full at start (available == allocation) and drain with usage
  const freeProgress = Math.min(100, Math.max(0, (freeAvailable / (freeAllocation || 1)) * 100));
  const nextRenewal = creditBalance?.nextFreeRenewalAt
    ? new Date(creditBalance.nextFreeRenewalAt)
    : undefined;

  return (
    <div className="matrix-card border border-primary/20 rounded-lg w-full flex flex-col overflow-hidden">
      <div className="p-4 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary/15 to-transparent rounded-lg matrix-glow">
              <Brain className="size-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-foreground">{subscriptionName} plan</p>
              <p className="text-xs text-muted-foreground">{subscriptionDescription}</p>
            </div>
          </div>
        </div>

        {/* Free credits usage */}
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Zap className="size-3 text-muted-foreground" />
              Monthly free credits
            </p>
            <p className="text-xs text-primary font-medium">
              {Math.round(freeAvailable)} / {Math.round(freeAllocation)}
            </p>
          </div>
          <Progress value={freeProgress} className="w-full h-1.5 matrix-border" />
          {nextRenewal && (
            <p className="text-[10px] text-muted-foreground mt-1">Renews on {nextRenewal.toLocaleDateString()}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Bot className="size-3 text-muted-foreground" />
                AI Agents
              </p>
              <p className="text-xs text-primary font-medium">{usage.agents.countLabel}</p>
            </div>
            <Progress value={usage.agents.progress} className="w-full h-1.5 matrix-border" />
          </div>

          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <FolderOpen className="size-3 text-muted-foreground" />
                Sessions
              </p>
              <p className="text-xs text-primary font-medium">{usage.sessions.countLabel}</p>
            </div>
            <Progress value={usage.sessions.progress} className="w-full h-1.5 matrix-border" />
          </div>

          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MessageSquare className="size-3 text-muted-foreground" />
                Conversations
              </p>
              <p className="text-xs text-primary font-medium">{usage.conversations.countLabel}</p>
            </div>
            <Progress value={usage.conversations.progress} className="w-full h-1.5 matrix-border" />
          </div>
        </div>
      </div>

      <Button
        className="bg-primary/10 border-t border-primary/20 hover:bg-primary/20 rounded-t-none text-primary font-semibold matrix-glow hover:matrix-border transition-all duration-300"
        variant="ghost"
        asChild
      >
        <Link href="/upgrade" className="flex items-center space-x-2">
          <Zap className="size-4" />
          <span>Upgrade</span>
        </Link>
      </Button>
    </div>
  );
};




