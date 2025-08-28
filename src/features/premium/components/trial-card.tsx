"use client";

import Link from "next/link";
import { Zap, Brain, MessageSquare, Bot, FolderOpen, Coins } from "lucide-react";
import { TRIAL_LIMITS } from "@/constants/credits";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQueryCurrentSubscription, useQueryUsage } from "../api";
import { useQueryCreditsBalance } from "@/features/credits/api";
import { getUsageMetrics } from "../utils";

export const DashboardTrial = () => {
  const { data } = useQueryUsage();
  const { data: currentSubscription } = useQueryCurrentSubscription();
  const { data: creditsBalance } = useQueryCreditsBalance();
  const [subscriptionName = "Free", subscriptionDescription = "Limited access until you upgrade"] = currentSubscription?.name.split(" – ") ?? ["Free", "Limited access until you upgrade"];
  const usage = getUsageMetrics(data);
  
  // Format credits with commas for better readability
  const formatCredits = (credits: number) => {
    return new Intl.NumberFormat('en-US').format(credits);
  };

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

        {/* Paid Credits Balance Display */}
        <div className="relative">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg border border-primary/10 matrix-glow">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <p className="text-xs font-semibold text-foreground">Paid Credits</p>
                <p className="text-[10px] text-muted-foreground">Available balance</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Coins className="size-3 text-primary/80" />
              <span className="text-lg font-bold text-primary matrix-text">
                {formatCredits(creditsBalance?.balance ?? 0)}
              </span>
            </div>
          </div>
          {/* Subtle matrix-style corner accent */}
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary/30 rounded-full matrix-glow opacity-75"></div>
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Zap className="size-3 text-muted-foreground" />
              Monthly free credits
            </p>
            <p className="text-xs text-primary font-medium">
              {Math.round(TRIAL_LIMITS.CREDITS_USED_EXAMPLE)} / {Math.round(TRIAL_LIMITS.FREE_MONTHLY_CREDITS)}
            </p>
          </div>
          <Progress value={(TRIAL_LIMITS.CREDITS_USED_EXAMPLE / TRIAL_LIMITS.FREE_MONTHLY_CREDITS) * 100} className="w-full h-1.5 matrix-border" />
          <p className="text-[10px] text-muted-foreground mt-1">Renews on {TRIAL_LIMITS.NEXT_RENEWAL_DATE}</p>
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

export const DashboardTrialLoading = () => {
  return (
    <div className="matrix-card border border-primary/20 rounded-lg w-full flex flex-col overflow-hidden">
      <div className="p-4 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary/15 to-transparent rounded-lg matrix-glow">
              <Brain className="size-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <div className="h-4 w-20 bg-muted rounded mb-1" />
              <div className="h-3 w-32 bg-muted rounded" />
            </div>
          </div>
        </div>

        {/* Paid Credits Balance Loading */}
        <div className="relative">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg border border-primary/10 matrix-glow">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-2 w-20 bg-muted rounded" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Coins className="size-3 text-primary/80" />
              <div className="h-5 w-12 bg-muted rounded" />
            </div>
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary/30 rounded-full matrix-glow opacity-75"></div>
        </div>

        {/* Monthly Credits Loading */}
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-10 bg-muted rounded" />
          </div>
          <Progress value={0} className="w-full h-1.5 matrix-border" />
          <div className="h-2 w-20 bg-muted rounded mt-1" />
        </div>

        <div className="flex flex-col gap-y-3">
          {[0, 1, 2].map((key) => (
            <div key={key} className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-3 w-10 bg-muted rounded" />
              </div>
              <Progress value={0} className="w-full h-1.5 matrix-border" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-primary/10 border-t border-primary/20 rounded-t-none text-primary font-semibold matrix-glow" />
    </div>
  );
};


