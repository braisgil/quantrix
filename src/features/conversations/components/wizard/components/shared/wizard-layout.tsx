import { Card, CardContent } from "@/components/ui/card";
import { StepHeader } from "./step-header";
import type { StepHeaderProps } from "../../types/wizard";

interface WizardLayoutProps extends StepHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const WizardLayout = ({ 
  title, 
  description, 
  icon, 
  children, 
  className 
}: WizardLayoutProps) => {
  return (
    <div className="w-full">
      <Card className={`w-full mx-auto matrix-card border-primary/20 backdrop-blur-md ${className || ''}`}>
        <StepHeader title={title} description={description} icon={icon} />
        <CardContent className="pb-4 sm:pb-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}; 