import { CardHeader } from "@/components/ui/card";
import type { StepHeaderProps } from "../../types/wizard";

export const StepHeader = ({ title, description, icon: Icon }: StepHeaderProps) => {
  return (
    <CardHeader className="pb-0 sm:pb-0">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative matrix-glow">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center matrix-border">
            <Icon className="w-4 h-4 text-black" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold quantrix-gradient matrix-text-glow">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        </div>
      </div>
    </CardHeader>
  );
}; 