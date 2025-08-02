import { Settings, Users, BookOpen, Sparkles } from "lucide-react";
import { CUSTOM_RULE_OPTIONS } from "@/constants/agent-categories";
import { WizardLayout } from "../shared/WizardLayout";
import { SelectionGrid } from "../shared/SelectionGrid";
import { OptionCard } from "../shared/OptionCard";
import type { StepProps } from "../../types/wizard";
import { useSelectionState } from "../../hooks/use-selection-state";
import { MANUAL_ICONS, customRuleIconResolver } from "../../lib/icon-mappings";
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
              const iconConfig = customRuleIconResolver(option.id, option.name, selected);

              return (
                <OptionCard
                  key={option.id}
                  id={option.id}
                  name={option.name}
                  description={option.description}
                  isSelected={selected}
                  onClick={() => selectCustomRule1(option.id)}
                  icon={getInteractionIcon(option.name)}
                  iconColor={iconConfig.color}
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
              const iconConfig = customRuleIconResolver(option.id, option.name, selected);

              return (
                <OptionCard
                  key={option.id}
                  id={option.id}
                  name={option.name}
                  description={option.description}
                  isSelected={selected}
                  onClick={() => selectCustomRule2(option.id)}
                  icon={getLearningIcon()}
                  iconColor={iconConfig.color}
                  badges={["Learning Approach"]}
                />
              );
            })}
          </SelectionGrid>
        </div>

        {/* Summary */}
        {wizardState.customRule1 && wizardState.customRule2 && (
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
              {/* Selected Options */}
              <div className="space-y-3">
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
              </div>
              
              {/* What This Means */}
              <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
                <div className="flex items-center mb-3">
                  <Sparkles className="w-4 h-4 text-primary mr-2" />
                  <h6 className="font-semibold text-primary">What This Means</h6>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Consistent communication style in all conversations",
                    "Responses adapted to your preferences and context",
                    "Support approach tailored to how you learn best",
                    "Thoughtful integration of knowledge and empathy"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
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
