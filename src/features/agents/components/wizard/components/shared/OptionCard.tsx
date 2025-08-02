import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import type { OptionCardProps } from "../../types/wizard";
import { 
  getCardClasses, 
  getIconContainerClasses, 
  getTitleClasses, 
  getDescriptionClasses,
  getBadgeClasses,
} from "../../lib/wizard-utils";
import { cn } from "@/lib/utils";

export const OptionCard = ({
  name,
  description,
  isSelected,
  onClick,
  icon: Icon,
  iconColor,
  badges = [],
  className
}: OptionCardProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(getCardClasses(isSelected), className)}
      onClick={onClick}
    >
      <div className="p-3 sm:p-4 md:p-6 w-full h-full text-left relative overflow-hidden flex flex-col">
        <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
          {/* Icon Container */}
          {Icon && (
            <div className={getIconContainerClasses(isSelected)}>
              <Icon 
                className={cn(
                  "transition-all duration-500",
                  isSelected 
                    ? "!w-6 !h-6 sm:!w-8 sm:!h-8" 
                    : "!w-5 !h-5 sm:!w-7 sm:!h-7",
                  iconColor || "text-primary"
                )} 
              />
            </div>
          )}
          
          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className={getTitleClasses(isSelected)} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              {name}
            </div>
            {description && (
              <div className={getDescriptionClasses()} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                {description}
              </div>
            )}
          </div>
        </div>
        
        {/* Selection indicator */}
        {isSelected && (
          <CheckCircle2 className="absolute bottom-2 right-4 w-6 h-6 text-primary animate-in zoom-in duration-500 matrix-glow" />
        )}
        
        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto pt-1.5 sm:pt-2">
            {badges.slice(0, 3).map((badge, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={getBadgeClasses(isSelected)}
              >
                {badge}
              </Badge>
            ))}
            {badges.length > 3 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{badges.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>
    </Button>
  );
};
