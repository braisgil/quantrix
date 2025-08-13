import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StepHeaderProps } from "../../types/wizard";

export const StepHeader = ({ title, description, icon: Icon }: StepHeaderProps) => {
  return (
    <CardHeader className="text-center pb-3 sm:pb-4">
      {/* Compact Header - Icon and Title Inline */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="relative matrix-glow">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center matrix-border">
            <Icon className="w-3 h-3 text-primary-foreground" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
        </div>
        <CardTitle className="text-lg sm:text-xl font-bold quantrix-gradient matrix-text-glow">
          {title}
        </CardTitle>
      </div>
      <CardDescription className="text-sm text-muted-foreground">
        {description}
      </CardDescription>
    </CardHeader>
  );
};
