import { Settings, Users, BookOpen, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CUSTOM_RULE_OPTIONS } from "@/constants/agent-categories";
import { WizardLayout } from "../shared/wizard-layout";
import { SelectionGrid } from "../shared/selection-grid";
import { OptionCard } from "../shared/option-card";
import type { StepProps } from "../../types/wizard";
import { useSelectionState } from "../../hooks/use-selection-state";
import { MANUAL_ICONS } from "../../lib/icon-mappings";
import { getAnimationClasses } from "../../lib/wizard-utils";
import { cn } from "@/lib/utils";

export const StepCustomRules = ({ wizardState, updateWizardState }: StepProps) => {
  const { selectCustomRule1, selectCustomRule2, isSelected } = useSelectionState({ 
    wizardState, 
    updateWizardState 
  });

  const getSelectedRule1 = () => {
    return CUSTOM_RULE_OPTIONS.interaction_style.options.find(
      opt => opt.id === wizardState.customRule1
    );
  };

  const getSelectedRule2 = () => {
    return CUSTOM_RULE_OPTIONS.learning_approach.options.find(
      opt => opt.id === wizardState.customRule2
    );
  };

  const getInteractionIcon = (optionName: string) => {
    const name = optionName.toLowerCase();
    if (name.includes('supportive') || name.includes('encouraging')) return MANUAL_ICONS.supportive;
    if (name.includes('direct') || name.includes('challenging')) return MANUAL_ICONS.direct;
    if (name.includes('energetic') || name.includes('dynamic')) return MANUAL_ICONS.enthusiastic;
    if (name.includes('analytical') || name.includes('methodical')) return MANUAL_ICONS.analytical;
    if (name.includes('collaborative')) return MANUAL_ICONS.collaborative;
    if (name.includes('professional') || name.includes('formal')) return MANUAL_ICONS.professional;
    if (name.includes('creative') || name.includes('inspiring')) return MANUAL_ICONS.creative;
    if (name.includes('conversational') || name.includes('casual')) return MANUAL_ICONS.conversational;
    return Users;
  };

  const getLearningIcon = () => BookOpen;

  return (
    <WizardLayout
      title="Personalize Communication Style"
      description="Help your AI companion understand how you prefer to communicate and learn"
      icon={Settings}
    >
      <div className="space-y-8">
        {/* Interaction Style */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-primary matrix-text-glow">
                {CUSTOM_RULE_OPTIONS.interaction_style.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {CUSTOM_RULE_OPTIONS.interaction_style.description}
              </p>
            </div>
          </div>
          
          <SelectionGrid columns="3">
            {CUSTOM_RULE_OPTIONS.interaction_style.options.map((option) => {
              const selected = isSelected.customRule1(option.id);

              return (
                <OptionCard
                  key={option.id}
                  id={option.id}
                  name={option.name}
                  description={option.description}
                  isSelected={selected}
                  onClick={() => selectCustomRule1(option.id)}
                  icon={getInteractionIcon(option.name)}
                  iconColor={selected ? "text-primary-foreground" : "text-muted-foreground"}
                  badges={["Communication Style"]}
                />
              );
            })}
          </SelectionGrid>
        </div>

        {/* Learning Approach */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-primary matrix-text-glow">
                {CUSTOM_RULE_OPTIONS.learning_approach.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {CUSTOM_RULE_OPTIONS.learning_approach.description}
              </p>
            </div>
          </div>
          
          <SelectionGrid columns="2">
            {CUSTOM_RULE_OPTIONS.learning_approach.options.map((option) => {
              const selected = isSelected.customRule2(option.id);

              return (
                <OptionCard
                  key={option.id}
                  id={option.id}
                  name={option.name}
                  description={option.description}
                  isSelected={selected}
                  onClick={() => selectCustomRule2(option.id)}
                  icon={getLearningIcon()}
                  iconColor={selected ? "text-primary-foreground" : "text-muted-foreground"}
                  badges={["Learning Approach"]}
                />
              );
            })}
          </SelectionGrid>
        </div>

        {/* ADDITIONAL Custom Instructions Section */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-primary matrix-text-glow">
                Additional Custom Instructions
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add specific instructions to further personalize your AI companion&apos;s behavior
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="additionalRule1" className="text-base font-semibold text-primary matrix-text-glow">
                Additional Rule 1 (Optional)
              </Label>
              <Input
                id="additionalRule1"
                type="text"
                placeholder="e.g., Focus on practical examples, Use beginner-friendly language, Explain concepts step-by-step..."
                value={wizardState.additionalRule1 || ""}
                onChange={(e) => updateWizardState({ additionalRule1: e.target.value || null })}
                className="text-base p-3 h-12 border-primary/30 focus:border-primary focus:ring-primary/50 bg-background/50 backdrop-blur-sm matrix-border transition-all duration-300"
              />
              <p className="text-xs text-muted-foreground">
                Specify how you want your AI to approach problems and explanations
              </p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="additionalRule2" className="text-base font-semibold text-primary matrix-text-glow">
                Additional Rule 2 (Optional)
              </Label>
              <Input
                id="additionalRule2"
                type="text"
                placeholder="e.g., Always ask clarifying questions, Provide multiple solutions, Include relevant resources..."
                value={wizardState.additionalRule2 || ""}
                onChange={(e) => updateWizardState({ additionalRule2: e.target.value || null })}
                className="text-base p-3 h-12 border-primary/30 focus:border-primary focus:ring-primary/50 bg-background/50 backdrop-blur-sm matrix-border transition-all duration-300"
              />
              <p className="text-xs text-muted-foreground">
                Define additional communication preferences or specific requirements
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        {(wizardState.customRule1 || wizardState.customRule2 || wizardState.additionalRule1 || wizardState.additionalRule2) && (
          <div className={cn(
            "mt-6 p-4 bg-primary/10 rounded-lg matrix-border",
            getAnimationClasses("fadeIn")
          )}>
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
              <h4 className="font-bold text-base sm:text-lg text-primary matrix-text-glow">
                Communication Preferences Set
              </h4>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Predefined Rules */}
              <div className="space-y-3">
                {getSelectedRule1() && (
                  <div>
                    <h5 className="font-semibold text-primary mb-2">Communication Style</h5>
                    <div className="p-3 bg-primary/5 rounded-lg matrix-border">
                      <div className="font-medium quantrix-gradient text-base break-words">
                        {getSelectedRule1()?.name}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {getSelectedRule1()?.description}
                      </div>
                    </div>
                  </div>
                )}
                
                {getSelectedRule2() && (
                  <div>
                    <h5 className="font-semibold text-primary mb-2">Learning Approach</h5>
                    <div className="p-3 bg-primary/5 rounded-lg matrix-border">
                      <div className="font-medium quantrix-gradient text-base break-words">
                        {getSelectedRule2()?.name}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {getSelectedRule2()?.description}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Additional Custom Rules */}
              <div className="space-y-3">
                {wizardState.additionalRule1 && (
                  <div>
                    <h5 className="font-semibold text-primary mb-2">Additional Rule 1</h5>
                    <div className="p-3 bg-primary/5 rounded-lg matrix-border">
                      <div className="font-medium quantrix-gradient text-base break-words mb-1">
                        Custom Instruction
                      </div>
                      <div className="text-sm text-muted-foreground break-words italic">
                        &quot;{wizardState.additionalRule1}&quot;
                      </div>
                    </div>
                  </div>
                )}
                
                {wizardState.additionalRule2 && (
                  <div>
                    <h5 className="font-semibold text-primary mb-2">Additional Rule 2</h5>
                    <div className="p-3 bg-primary/5 rounded-lg matrix-border">
                      <div className="font-medium quantrix-gradient text-base break-words mb-1">
                        Custom Instruction
                      </div>
                      <div className="text-sm text-muted-foreground break-words italic">
                        &quot;{wizardState.additionalRule2}&quot;
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Ready Banner */}
            <div className="mt-4 p-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg border border-primary/30">
              <div className="flex items-center justify-center space-x-2 text-center">
                <Sparkles className="w-4 h-4 text-primary animate-pulse flex-shrink-0" />
                <span className="text-sm font-medium text-primary">
                  Your AI companion is ready to be created
                </span>
                <Sparkles className="w-4 h-4 text-primary animate-pulse flex-shrink-0" />
              </div>
            </div>
          </div>
        )}
      </div>
    </WizardLayout>
  );
};
