import { cn } from "@/lib/utils";

/**
 * Generate responsive grid classes based on column count
 */
export const getGridClasses = (columns: "1" | "2" | "3" = "2") => {
  const gridMappings = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
  };
  
  return gridMappings[columns];
};

/**
 * Get consistent card styling classes
 */
export const getCardClasses = (isSelected: boolean = false, variant: "default" | "compact" = "default") => {
  const baseClasses = "h-auto min-h-0 p-0 transition-all duration-300 group w-full";
  const variantClasses = {
    default: "",
    compact: "text-sm"
  };
  
  const stateClasses = isSelected
    ? "matrix-border matrix-glow bg-primary/10"
    : "border border-primary/10 hover:border-primary/30 hover:bg-primary/5";
    
  return cn(baseClasses, variantClasses[variant], stateClasses);
};

/**
 * Get consistent icon container classes
 */
export const getIconContainerClasses = (isSelected: boolean = false, size: "sm" | "md" | "lg" = "md") => {
  const sizeClasses = {
    sm: "w-8 h-8 sm:w-10 sm:h-10",
    md: "w-10 h-10 sm:w-12 sm:h-12",
    lg: "w-12 h-12 sm:w-14 sm:h-14"
  };
  
  const baseClasses = "rounded-xl flex items-center justify-center transition-all duration-500 flex-shrink-0";
  const stateClasses = isSelected
    ? "bg-gradient-to-br from-primary to-primary/80 matrix-glow matrix-border transform scale-105"
    : "bg-muted/30 group-hover:bg-primary/10 group-hover:scale-105";
    
  return cn(baseClasses, sizeClasses[size], stateClasses);
};

/**
 * Get consistent text classes for titles
 */
export const getTitleClasses = (isSelected: boolean = false, size: "sm" | "md" | "lg" = "md") => {
  const sizeClasses = {
    sm: "text-sm sm:text-base",
    md: "text-sm sm:text-base md:text-lg",
    lg: "text-base sm:text-lg md:text-xl"
  };
  
  const baseClasses = "font-bold transition-all duration-300 leading-tight break-words overflow-wrap-anywhere whitespace-normal";
  const stateClasses = isSelected
    ? "quantrix-gradient matrix-text-glow"
    : "text-foreground group-hover:text-primary";
    
  return cn(baseClasses, sizeClasses[size], stateClasses);
};

/**
 * Get consistent description classes
 */
export const getDescriptionClasses = (size: "sm" | "md" = "md") => {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-xs sm:text-sm"
  };
  
  return cn(
    "text-muted-foreground mt-1 sm:mt-1.5 leading-relaxed break-words overflow-wrap-anywhere whitespace-normal",
    sizeClasses[size]
  );
};

/**
 * Get badge classes
 */
export const getBadgeClasses = (isActive: boolean = false, variant: "default" | "outline" = "default") => {
  const baseClasses = "text-xs transition-all duration-300";
  
  if (variant === "outline") {
    return cn(baseClasses, "bg-primary/5 text-primary border-primary/30");
  }
  
  const stateClasses = isActive
    ? "bg-primary/20 text-primary border-primary/30"
    : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary";
    
  return cn(baseClasses, stateClasses);
};

/**
 * Animation classes for entrance effects
 */
export const getAnimationClasses = (type: "fadeIn" | "slideIn" | "zoomIn" = "fadeIn") => {
  const animations = {
    fadeIn: "animate-in fade-in duration-500",
    slideIn: "animate-in slide-in-from-bottom-4 duration-500",
    zoomIn: "animate-in zoom-in duration-500"
  };
  
  return animations[type];
};

/**
 * Calculate progress percentage
 */
export const getProgressPercentage = (currentStep: number, totalSteps: number = 5): number => {
  return ((currentStep + 1) / totalSteps) * 100;
};


