import type { SelectionGridProps } from "../../types/wizard";
import { getGridClasses } from "../../lib/wizard-utils";
import { cn } from "@/lib/utils"; 

export const SelectionGrid = ({ 
  children, 
  columns = "2", 
  className 
}: SelectionGridProps) => {
  return (
    <div className={cn(
      "grid gap-3 sm:gap-4 mb-4 sm:mb-6 w-full",
      getGridClasses(columns),
      className
    )}>
      {children}
    </div>
  );
};
