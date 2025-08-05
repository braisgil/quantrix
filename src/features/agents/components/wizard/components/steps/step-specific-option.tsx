import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { AGENT_CATEGORIES } from "@/constants/agent-categories";
import { WizardLayout } from "../shared/wizard-layout";
import { SelectionGrid } from "../shared/selection-grid";
import { OptionCard } from "../shared/option-card";
import type { StepProps, SubcategoryData } from "../../types/wizard";
import { useSelectionState } from "../../hooks/use-selection-state";
import { specificOptionIconResolver } from "../../lib/icon-mappings";
import { getAnimationClasses } from "../../lib/wizard-utils";
import { cn } from "@/lib/utils";

export const StepSpecificOption = ({ wizardState, updateWizardState }: StepProps) => {
  const { selectSpecificOption, isSelected } = useSelectionState({ wizardState, updateWizardState });

  if (!wizardState.category || !wizardState.subcategory || !wizardState.subSubcategory) {
    return null;
  }

  const categoryData = AGENT_CATEGORIES[wizardState.category];
  const subcategoryData = (categoryData.subcategories as Record<string, SubcategoryData>)[wizardState.subcategory];
  const subSubcategoryData = subcategoryData.subSubcategories[wizardState.subSubcategory];

  return (
    <WizardLayout
      title="Choose Your Specific Focus"
      description={`Select the exact type of help you'd like within ${subSubcategoryData.name}`}
      icon={Zap}
    >
      <div className="space-y-6">
        {/* Context Banner */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-3 py-2 rounded-lg matrix-border">
            <span className="text-sm text-muted-foreground">Setting up assistance for:</span>
            <Badge variant="secondary" className="bg-primary/20 text-primary break-words">
              {subSubcategoryData.name}
            </Badge>
          </div>
        </div>

        {/* Options Selection */}
        <SelectionGrid columns="3">
          {subSubcategoryData.options.map((option: string) => {
            const selected = isSelected.specificOption(option);
            const iconConfig = specificOptionIconResolver('', option, selected);

            return (
              <OptionCard
                key={option}
                id={option}
                name={option}
                description={`Focused assistance with ${option.toLowerCase()}`}
                isSelected={selected}
                onClick={() => selectSpecificOption(option)}
                icon={iconConfig.component}
                iconColor={iconConfig.color}
                badges={["Specialized Focus"]}
              />
            );
          })}
        </SelectionGrid>

        {/* Selection Summary */}
        {wizardState.specificOption && (
          <div className={cn(
            "mt-6 p-4 bg-primary/10 rounded-lg matrix-border",
            getAnimationClasses("fadeIn")
          )}>
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
              <h4 className="font-semibold text-primary matrix-text-glow">Support Focus Selected</h4>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Selected Option Details */}
              <div>
                <h5 className="font-bold text-lg sm:text-xl quantrix-gradient mb-2 break-words">
                  {wizardState.specificOption}
                </h5>
                <p className="text-sm text-muted-foreground mb-3">
                  Your AI companion will focus on helping you with this specific area, 
                  providing personalized, knowledgeable assistance tailored to your needs.
                </p>
                
                <div className="space-y-2">
                  {[
                    "Focused Knowledge",
                    "Personalized Help",
                    "Adaptive Support"
                  ].map((feature, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="bg-primary/5 text-primary border-primary/30 mr-2"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* What to Expect */}
              <div className="matrix-card border-primary/10 p-3 rounded-lg bg-primary/5">
                <div className="flex items-center mb-2">
                  <Zap className="w-4 h-4 text-primary mr-2" />
                  <h6 className="font-medium text-primary">What You Can Expect</h6>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    `Focused knowledge in ${wizardState.specificOption.toLowerCase()}`,
                    "Thoughtful, context-aware responses",
                    "Support tailored to your pace and style",
                    "Helpful, patient guidance"
                  ].map((expectation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">•</span>
                      <span>{expectation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </WizardLayout>
  );
};
