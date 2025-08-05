import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2, Circle, Zap } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

// Import refactored components
import { useAgentWizard } from "../hooks/use-agent-wizard";
import { useStepValidation } from "../hooks/use-step-validation";
import { StepBasicInfo } from "./steps/step-basic-info";
import { StepCategorySelection } from "./steps/step-category-selection";
import { StepSubcategorySelection } from "./steps/step-subcategory-selection";
import { StepSpecificOption } from "./steps/step-specific-option";
import { StepCustomRules } from "./steps/step-custom-rules";
import { STEP_CONFIGS, getTotalSteps } from "../lib/step-config";
import { getProgressPercentage } from "../lib/wizard-utils";
import { cn } from "@/lib/utils";
import { AgentNavigationHeader } from "../../shared/agent-navigation-header";

interface AgentWizardProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AgentWizard = ({ onSuccess, onCancel }: AgentWizardProps) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  
  const {
    currentStep,
    wizardState,
    updateWizardState,
    nextStep,
    prevStep,
    resetWizard,
    getFormData,
  } = useAgentWizard();

  const { canProceed } = useStepValidation(wizardState);

  const createAgentMutation = useMutation(
    trpc.agents.create.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        trpc.agents.getMany.queryOptions({})
      );
      toast.success("Your AI companion has been created successfully!");
      resetWizard();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create your AI companion");
    },
  }));

  const handleNext = () => {
    if (canProceed(currentStep)) {
      nextStep();
    }
  };

  const handleSubmit = () => {
    const formData = getFormData();
    createAgentMutation.mutate(formData);
  };

  const renderCurrentStep = () => {
    const stepProps = { wizardState, updateWizardState };
    
    switch (currentStep) {
      case 0: return <StepBasicInfo {...stepProps} />;
      case 1: return <StepCategorySelection {...stepProps} />;
      case 2: return <StepSubcategorySelection {...stepProps} />;
      case 3: return <StepSpecificOption {...stepProps} />;
      case 4: return <StepCustomRules {...stepProps} />;
      default: return null;
    }
  };

  const totalSteps = getTotalSteps();
  const progressPercentage = getProgressPercentage(currentStep, totalSteps);
  const isLastStep = currentStep === totalSteps - 1;
  const canSubmit = canProceed(currentStep) && isLastStep;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Navigation Header */}
      <AgentNavigationHeader onCancel={onCancel} />

      {/* Enhanced Progress Header */}
      <Card className="matrix-card border-primary/20 backdrop-blur-md">
        <CardContent className="pt-3 pb-2">
          <div className="space-y-2">
            {/* Title and Logo */}
            <div className="flex items-center justify-center gap-2">
              <div className="relative matrix-glow">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center matrix-border">
                  <Zap className="w-3 h-3 text-black" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-base sm:text-lg font-bold quantrix-gradient matrix-text-glow">
                Create Your AI Companion
              </h1>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                  {STEP_CONFIGS[currentStep].name}
                </Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                  <Sparkles className="w-2.5 h-2.5 mr-1" />
                  Step {currentStep + 1} of {totalSteps}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <Progress 
                  value={progressPercentage} 
                  className="w-full h-1.5 matrix-border" 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.round(progressPercentage)}% Complete</span>
                  <span className="hidden sm:block">{STEP_CONFIGS[currentStep].description}</span>
                </div>
              </div>
            </div>

            {/* Step Navigation Pills */}
            <div className="flex flex-wrap justify-center gap-1.5">
                          {STEP_CONFIGS.map((step, index) => {
              return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center space-x-1 px-2 py-0.5 rounded-md transition-all duration-300",
                      index < currentStep
                        ? "bg-primary/20 matrix-border"
                        : index === currentStep
                        ? "bg-primary/10 matrix-glow border border-primary/30"
                        : "bg-muted/10 border border-muted/20"
                    )}
                  >
                    {index < currentStep ? (
                      <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
                    ) : index === currentStep ? (
                      <Circle className="w-2.5 h-2.5 text-primary animate-pulse" />
                    ) : (
                      <Circle className="w-2.5 h-2.5 text-muted-foreground" />
                    )}
                    <span className={cn(
                      "text-xs font-medium hidden sm:block",
                      index <= currentStep ? "text-primary" : "text-muted-foreground"
                    )}>
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <div className="w-full">
        {renderCurrentStep()}
      </div>

      {/* Navigation Footer */}
      <Card className="matrix-card border-primary/20 backdrop-blur-md">
        <CardFooter className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 pb-4">
          {/* Back and Cancel Buttons */}
          <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start gap-2">
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  size="sm"
                  className="border-primary/30 hover:bg-primary/10 hover:border-primary matrix-border text-xs"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              )}
              <Button 
                variant="ghost" 
                onClick={onCancel}
                size="sm"
                className="text-muted-foreground hover:text-foreground hidden sm:flex text-xs"
              >
                Cancel
              </Button>
            </div>

            {/* Mobile Action Button */}
            <div className="flex items-center gap-2 sm:hidden">
              {!isLastStep ? (
                <Button 
                  onClick={handleNext}
                  disabled={!canProceed(currentStep)}
                  size="sm"
                  className={cn(
                    "matrix-glow font-semibold px-4 text-xs",
                    canProceed(currentStep) 
                      ? "bg-primary hover:bg-primary/90 text-black" 
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span>Next</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={!canSubmit || createAgentMutation.isPending}
                  size="sm"
                  className="matrix-glow bg-primary hover:bg-primary/90 text-black font-semibold px-4 text-xs"
                >
                  {createAgentMutation.isPending ? (
                    <>
                      <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin mr-1" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 mr-1" />
                      <span>Create</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Desktop Action Button */}
          <div className="hidden sm:flex items-center gap-2">
            {!isLastStep ? (
              <Button 
                onClick={handleNext}
                disabled={!canProceed(currentStep)}
                size="sm"
                className={cn(
                  "matrix-glow font-semibold px-4 text-xs",
                  canProceed(currentStep) 
                    ? "bg-primary hover:bg-primary/90 text-black" 
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                <span>Continue</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!canSubmit || createAgentMutation.isPending}
                size="sm"
                className="matrix-glow bg-primary hover:bg-primary/90 text-black font-semibold px-4 text-xs"
              >
                {createAgentMutation.isPending ? (
                  <>
                    <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin mr-1" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 mr-1" />
                    <span>Create</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
