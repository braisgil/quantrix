"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export const UpgradeFooter = () => {
  return (
    <Card className="matrix-card py-0 bg-muted/50 border-primary/20 hover:matrix-border transition-all">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Payments secured by <a href="https://polar.sh" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground cursor-pointer">Polar.sh</a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
