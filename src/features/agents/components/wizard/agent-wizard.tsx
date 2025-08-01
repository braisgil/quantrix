import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2, Circle, Zap, X } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useAgentWizard } from "../../hooks/use-agent-wizard";
import { StepBasicInfo } from "./step-basic-info";
import { StepCategorySelection } from "./step-category-selection";
import { StepSubcategorySelection } from "./step-subcategory-selection";
import { StepSpecificOption } from "./step-specific-option";
import { StepCustomRules } from "./step-custom-rules";

interface AgentWizardProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const STEP_TITLES = [
  { name: "Getting Started", description: "Choose a name for your companion" },
  { name: "Purpose & Focus", description: "What kind of support do you need?" },
  { name: "Personalization", description: "Tailor your companion's approach" },
  { name: "Specialization", description: "Define specific areas of help" },
  { name: "Personality", description: "Set communication style and tone" }
];

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
    canProceed,
    generateInstructions
  } = useAgentWizard();

  const createAgentMutation = useMutation({
    mutationFn: (data: any) => trpc.agents.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Your AI companion has been created successfully!");
      resetWizard();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create your AI companion");
    },
  });

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
    switch (currentStep) {
      case 0:
        return <StepBasicInfo wizardState={wizardState} updateWizardState={updateWizardState} />;
      case 1:
        return <StepCategorySelection wizardState={wizardState} updateWizardState={updateWizardState} />;
      case 2:
        return <StepSubcategorySelection wizardState={wizardState} updateWizardState={updateWizardState} />;
      case 3:
        return <StepSpecificOption wizardState={wizardState} updateWizardState={updateWizardState} />;
      case 4:
        return <StepCustomRules wizardState={wizardState} updateWizardState={updateWizardState} />;
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / 5) * 100;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Back to Agents Button */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Agents
        </Button>
        <Button 
          variant="ghost"
          size="sm" 
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground lg:hidden"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Enhanced Progress Header */}
      <Card className="matrix-card border-primary/20 backdrop-blur-md">
        <CardContent className="pt-3 pb-2">
          <div className="space-y-2">
            {/* Title and Logo - Inline */}
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
                  {STEP_TITLES[currentStep].name}
                </Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                  <Sparkles className="w-2.5 h-2.5 mr-1" />
                  Step {currentStep + 1} of 5
                </Badge>
              </div>
              
              <div className="space-y-1">
                <Progress 
                  value={progressPercentage} 
                  className="w-full h-1.5 matrix-border" 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.round(progressPercentage)}% Complete</span>
                  <span className="hidden sm:block">{STEP_TITLES[currentStep].description}</span>
                </div>
              </div>
            </div>

            {/* Step Navigation Pills - Responsive */}
            <div className="flex flex-wrap justify-center gap-1.5">
              {STEP_TITLES.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-1 px-2 py-0.5 rounded-md transition-all duration-300 ${
                    index < currentStep
                      ? "bg-primary/20 matrix-border"
                      : index === currentStep
                      ? "bg-primary/10 matrix-glow border border-primary/30"
                      : "bg-muted/10 border border-muted/20"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
                  ) : index === currentStep ? (
                    <Circle className="w-2.5 h-2.5 text-primary animate-pulse" />
                  ) : (
                    <Circle className="w-2.5 h-2.5 text-muted-foreground" />
                  )}
                  <span className={`text-xs font-medium hidden sm:block ${
                    index <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <div className="w-full">
        {renderCurrentStep()}
      </div>

      {/* Enhanced Navigation */}
      <Card className="matrix-card border-primary/20 backdrop-blur-md">
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 pt-3 pb-3">
          <div className="flex items-center gap-2 order-2 sm:order-1">
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

          <div className="flex items-center gap-2 order-1 sm:order-2">
            {currentStep < 4 ? (
              <Button 
                onClick={handleNext}
                disabled={!canProceed(currentStep)}
                size="sm"
                className={`matrix-glow font-semibold px-3 sm:px-4 text-xs ${
                  canProceed(currentStep) 
                    ? "bg-primary hover:bg-primary/90 text-black" 
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <span className="hidden sm:inline">Continue</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!canProceed(currentStep) || createAgentMutation.isPending}
                size="sm"
                className="matrix-glow bg-primary hover:bg-primary/90 text-black font-semibold px-3 sm:px-4 text-xs"
              >
                {createAgentMutation.isPending ? (
                  <>
                    <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin mr-1" />
                    <span className="hidden sm:inline">Creating...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Create</span>
                    <span className="sm:hidden">Create</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Enhanced Preview Section (only on final step) */}
      {currentStep === 4 && canProceed(4) && (
        <Card className="matrix-card border-primary/20 backdrop-blur-md">
          <CardContent className="pt-6 pb-4">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="relative matrix-glow">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center matrix-border">
                    <Sparkles className="w-6 h-6 text-black" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold quantrix-gradient matrix-text-glow mb-2">
                Review Your AI Companion
              </h3>
              <p className="text-sm text-muted-foreground">
                Take a final look at your personalized AI assistant&apos;s configuration
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-primary mb-2">Companion Name</h4>
                  <div className="p-3 bg-primary/10 rounded-lg matrix-border">
                    <div className="text-base sm:text-lg font-bold quantrix-gradient break-words">
                      {wizardState.name}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2">Area of Focus</h4>
                  <div className="p-3 bg-primary/10 rounded-lg matrix-border">
                    <div className="font-medium break-words">
                      {wizardState.specificOption}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2">Instructions & Guidelines</h4>
                <div className="p-3 bg-primary/5 rounded-lg matrix-border max-h-48 overflow-y-auto">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono break-words">
                    {generateInstructions()}
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg border border-primary/30">
              <div className="flex items-center justify-center space-x-2 text-center">
                <Sparkles className="w-4 h-4 text-primary animate-pulse flex-shrink-0" />
                <span className="text-sm font-medium text-primary">
                  Configuration complete • Personality settings applied • Ready to create your companion
                </span>
                <Sparkles className="w-4 h-4 text-primary animate-pulse flex-shrink-0" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 