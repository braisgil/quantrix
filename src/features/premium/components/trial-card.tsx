"use client";

import Link from "next/link";
import { Zap, Brain, MessageSquare, Bot, FolderOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQueryCurrentSubscription, useQueryUsage } from "../api";
import { getUsageMetrics } from "../utils";

export const DashboardTrial = () => {
  const { data } = useQueryUsage();
  const { data: currentSubscription } = useQueryCurrentSubscription();
  const [subscriptionName = "Free", subscriptionDescription = "Limited access until you upgrade"] = currentSubscription?.name.split(" – ") ?? ["Free", "Limited access until you upgrade"];
  const usage = getUsageMetrics(data);

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


