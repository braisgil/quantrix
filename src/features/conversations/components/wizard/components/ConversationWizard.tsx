import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

// Import refactored components
import { useConversationWizard } from "../hooks/use-conversation-wizard";
import { useStepValidation } from "../hooks/use-step-validation";
import { StepConversationDetails } from "./steps/StepConversationDetails";
import { STEP_CONFIGS } from "../lib/step-config";
import { cn } from "@/lib/utils";
import { ConversationNavigationHeader } from "../../shared/conversation-navigation-header";

interface ConversationWizardProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ConversationWizard = ({ onSuccess, onCancel }: ConversationWizardProps) => {
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
  } = useConversationWizard();

  const { canProceed } = useStepValidation(wizardState);

  const createConversationMutation = useMutation(
    trpc.conversations.create.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        trpc.conversations.getMany.queryOptions({})
      );
      toast.success("Your conversation has been scheduled successfully!");
      resetWizard();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to schedule your conversation");
    },
  }));

  const handleNext = () => {
    if (canProceed(currentStep)) {
      nextStep();
    }
  };

  const handleSubmit = () => {
    const formData = getFormData();
    createConversationMutation.mutate(formData);
  };

  const renderCurrentStep = () => {
    const stepProps = { wizardState, updateWizardState };
    
    switch (currentStep) {
      case 0: return <StepConversationDetails {...stepProps} />;
      default: return null;
    }
  };

  const isLastStep = true; // Single step form
  const canSubmit = canProceed(currentStep) && isLastStep;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Navigation Header */}
      <ConversationNavigationHeader onCancel={onCancel} />
      {/* Enhanced Progress Header */}
      <Card className="matrix-card border-primary/20 backdrop-blur-md">
        <CardContent className="pt-3 pb-2">
          <div className="space-y-2">
            {/* Title and Logo */}
            <div className="flex items-center justify-center gap-2">
              <div className="relative matrix-glow">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center matrix-border">
                  <MessageSquare className="w-3 h-3 text-black" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-base sm:text-lg font-bold quantrix-gradient matrix-text-glow">
                Schedule Your Conversation
              </h1>
            </div>

            {/* Step Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                  <Sparkles className="w-2.5 h-2.5 mr-1" />
                  {STEP_CONFIGS[currentStep].name}
                </Badge>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {STEP_CONFIGS[currentStep].description}
                </p>
              </div>
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
                  <Sparkles className="w-3 h-3 ml-1" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={!canSubmit || createConversationMutation.isPending}
                  size="sm"
                  className="matrix-glow bg-primary hover:bg-primary/90 text-black font-semibold px-4 text-xs"
                >
                  {createConversationMutation.isPending ? (
                    <>
                      <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin mr-1" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 mr-1" />
                      <span>Schedule</span>
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
                <Sparkles className="w-3 h-3 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!canSubmit || createConversationMutation.isPending}
                size="sm"
                className="matrix-glow bg-primary hover:bg-primary/90 text-black font-semibold px-4 text-xs"
              >
                {createConversationMutation.isPending ? (
                  <>
                    <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin mr-1" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 mr-1" />
                    <span>Schedule Conversation</span>
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