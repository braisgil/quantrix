import Link from "next/link";
import { Zap, Brain } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";

// import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// import {
//   MAX_FREE_AGENTS,
//   MAX_FREE_MEETINGS,
// } from "@/modules/premium/constants";

export const DashboardTrial = () => {
  // const trpc = useTRPC();
  // const { data } = useQuery(trpc.premium.getFreeUsage.queryOptions());

  // if (!data) return null;

  return (
    <div className="matrix-card border border-primary/20 rounded-lg w-full flex flex-col overflow-hidden">
      <div className="p-4 flex flex-col gap-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
            <Brain className="size-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-foreground">Neural Trial</p>
            <p className="text-xs text-muted-foreground">Free Matrix Access</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">AI Agents</p>
              <p className="text-xs text-primary font-medium">0/3</p>
            </div>
            <Progress value={0} className="h-2 bg-muted/50" />
          </div>
          
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Neural Sessions</p>
              <p className="text-xs text-primary font-medium">0/10</p>
            </div>
            <Progress value={0} className="h-2 bg-muted/50" />
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
