import Link from "next/link";
import { Zap, Brain, MessageSquare, Bot, FolderOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// import {
//   MAX_FREE_AGENTS,
//   MAX_FREE_MEETINGS,
// } from "@/modules/premium/constants";

export const DashboardTrial = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.premium.getUsage.queryOptions());
  const { data: subscription } = useQuery(trpc.premium.getCurrentSubscription.queryOptions());
  const { data: products } = useQuery(trpc.premium.getProducts.queryOptions());

  if (!data) return null;

  // debugger review rerenders

  return (
    <div className="matrix-card border border-primary/20 rounded-lg w-full flex flex-col overflow-hidden">
      <div className="p-4 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary/15 to-transparent rounded-lg matrix-glow">
              <Brain className="size-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-foreground">Free plan</p>
              <p className="text-xs text-muted-foreground">Limited access until you upgrade</p>
            </div>
          </div>
          <Badge variant="outline" className="border-primary/40 text-primary">Trial</Badge>
        </div>

        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Bot className="size-3 text-muted-foreground" />
                AI Agents
              </p>
              <p className="text-xs text-primary font-medium">0/1</p>
            </div>
            <Progress value={0} className="w-full h-1.5 matrix-border" />
          </div>

          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <FolderOpen className="size-3 text-muted-foreground" />
                Sessions
              </p>
              <p className="text-xs text-primary font-medium">0/1</p>
            </div>
            <Progress value={0} className="w-full h-1.5 matrix-border" />
          </div>

          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MessageSquare className="size-3 text-muted-foreground" />
                Conversations
              </p>
              <p className="text-xs text-primary font-medium">0/3</p>
            </div>
            <Progress value={0} className="w-full h-1.5 matrix-border" />
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
          <span>Upgrade to Quantum</span>
        </Link>
      </Button>
    </div>
  );
};
