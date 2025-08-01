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
  { name: "Neural Genesis", description: "Initialize agent designation" },
  { name: "Domain Selection", description: "Choose intelligence sector" },
  { name: "Pathway Refinement", description: "Define cognitive architecture" },
  { name: "Specialization", description: "Activate core expertise" },
  { name: "Personality Matrix", description: "Configure behavioral patterns" }
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
    mutationFn: trpc.agents.create.mutate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Neural agent successfully initialized!");
      resetWizard();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to initialize neural agent");
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
        <CardContent className="pt-6 pb-4">
          <div className="space-y-4">
            {/* Title and Status */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center mb-3">
                <div className="relative matrix-glow">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center matrix-border">
                    <Zap className="w-5 h-5 text-black" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold quantrix-gradient matrix-text-glow">
                Neural Agent Initialization Protocol
              </h1>
              <p className="text-sm text-muted-foreground">
                Configuring advanced AI companion with specialized neural pathways
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-sm">
                  {STEP_TITLES[currentStep].name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Phase {currentStep + 1} of 5
                </span>
              </div>
              
              <div className="space-y-2">
                <Progress 
                  value={progressPercentage} 
                  className="w-full h-2 matrix-border" 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.round(progressPercentage)}% Complete</span>
                  <span className="hidden sm:block">{STEP_TITLES[currentStep].description}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-primary/20" />

            {/* Step Navigation Pills - Responsive */}
            <div className="flex flex-wrap justify-center gap-2">
              {STEP_TITLES.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-lg transition-all duration-300 ${
                    index < currentStep
                      ? "bg-primary/20 matrix-border"
                      : index === currentStep
                      ? "bg-primary/10 matrix-glow border border-primary/30"
                      : "bg-muted/10 border border-muted/20"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                  ) : index === currentStep ? (
                    <Circle className="w-3 h-3 text-primary animate-pulse" />
                  ) : (
                    <Circle className="w-3 h-3 text-muted-foreground" />
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
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 pb-4">
          <div className="flex items-center gap-3 order-2 sm:order-1">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-primary/30 hover:bg-primary/10 hover:border-primary matrix-border"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Previous Phase</span>
                <span className="sm:hidden">Previous</span>
              </Button>
            )}
            <Button 
              variant="ghost" 
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground hidden sm:flex"
            >
              Abort Protocol
            </Button>
          </div>

          <div className="flex items-center gap-3 order-1 sm:order-2">
            {currentStep < 4 ? (
              <Button 
                onClick={handleNext}
                disabled={!canProceed(currentStep)}
                className={`matrix-glow font-semibold px-4 sm:px-6 ${
                  canProceed(currentStep) 
                    ? "bg-primary hover:bg-primary/90 text-black" 
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <span className="hidden sm:inline">Continue Protocol</span>
                <span className="sm:hidden">Continue</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!canProceed(currentStep) || createAgentMutation.isPending}
                className="matrix-glow bg-primary hover:bg-primary/90 text-black font-semibold px-4 sm:px-6"
              >
                {createAgentMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2" />
                    <span className="hidden sm:inline">Initializing Neural Matrix...</span>
                    <span className="sm:hidden">Initializing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Initialize AI Companion</span>
                    <span className="sm:hidden">Initialize</span>
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
                Neural Agent Configuration Preview
              </h3>
              <p className="text-sm text-muted-foreground">
                Final review of your AI companion's specifications
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-primary mb-2">Agent Designation</h4>
                  <div className="p-3 bg-primary/10 rounded-lg matrix-border">
                    <div className="text-base sm:text-lg font-bold quantrix-gradient break-words">
                      {wizardState.name}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2">Core Specialization</h4>
                  <div className="p-3 bg-primary/10 rounded-lg matrix-border">
                    <div className="font-medium break-words">
                      {wizardState.specificOption}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2">Neural Instructions</h4>
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
                  Neural pathways configured • Personality matrix optimized • Ready for initialization
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