import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { ProgressSummaryProps } from "../../types/wizard";
import { getAnimationClasses } from "../../lib/wizard-utils";
import { cn } from "@/lib/utils";

export const ProgressSummary = ({ title, items, className }: ProgressSummaryProps) => {
  return (
    <div className={cn(
      "mt-6 p-4 bg-primary/10 rounded-lg matrix-border",
      getAnimationClasses("fadeIn"),
      className
    )}>
      <div className="flex items-center mb-3">
        <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
        <h4 className="font-semibold text-primary matrix-text-glow">{title}</h4>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
              {item.label}
            </Badge>
            <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="font-medium break-words">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
