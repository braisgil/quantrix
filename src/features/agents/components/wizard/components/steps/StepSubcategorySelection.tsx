import { Network } from "lucide-react";
import { AGENT_CATEGORIES } from "@/constants/agent-categories";
import { WizardLayout } from "../shared/WizardLayout";
import { SelectionGrid } from "../shared/SelectionGrid";
import { OptionCard } from "../shared/OptionCard";
import { ProgressSummary } from "../shared/ProgressSummary";
import type { StepProps } from "../../types/wizard";
import { useSelectionState } from "../../hooks/use-selection-state";
import { subcategoryIconResolver } from "../../lib/icon-mappings";
import { getAnimationClasses, cn } from "../../lib/wizard-utils";

export const StepSubcategorySelection = ({ wizardState, updateWizardState }: StepProps) => {
  const { selectSubcategory, selectSubSubcategory, isSelected } = useSelectionState({ 
    wizardState, 
    updateWizardState 
  });

  if (!wizardState.category) return null;

  const categoryData = AGENT_CATEGORIES[wizardState.category];
  const subcategoryData = wizardState.subcategory 
    ? (categoryData.subcategories as any)[wizardState.subcategory] 
    : null;

  const subcategoryEntries = Object.entries(categoryData.subcategories);
  const subSubcategoryEntries = subcategoryData 
    ? Object.entries(subcategoryData.subSubcategories) 
    : [];

  return (
    <WizardLayout
      title="Personalize Your Support"
      description={`Help us understand the specific type of assistance you need within ${categoryData.name}`}
      icon={Network}
    >
      <div className="space-y-8">
        {/* Step 1: Subcategory Selection */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-xs font-bold text-primary">1</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-primary matrix-text-glow">
              Choose Your Focus
            </h3>
          </div>
          
          <SelectionGrid columns="3">
            {subcategoryEntries.map(([subcategoryId, subcategory]) => {
              const selected = isSelected.subcategory(subcategoryId);
              const iconConfig = subcategoryIconResolver(subcategoryId, subcategory.name, selected);
              const subSubcategoryNames = Object.values(subcategory.subSubcategories).map(
                (subSub: any) => subSub.name
              );

              return (
                <OptionCard
                  key={subcategoryId}
                  id={subcategoryId}
                  name={subcategory.name}
                  description={subcategory.description}
                  isSelected={selected}
                  onClick={() => selectSubcategory(subcategoryId)}
                  icon={iconConfig.component}
                  iconColor={iconConfig.color}
                  badges={subSubcategoryNames}
                />
              );
            })}
          </SelectionGrid>
        </div>

        {/* Step 2: Sub-subcategory Selection */}
        {wizardState.subcategory && subcategoryData && (
          <div className={getAnimationClasses("fadeIn")}>
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-primary matrix-text-glow">
                Refine Your Choice
              </h3>
            </div>
            
            <SelectionGrid columns="3">
              {subSubcategoryEntries.map(([subSubcategoryId, subSubcategory]: [string, any]) => {
                const selected = isSelected.subSubcategory(subSubcategoryId);
                const iconConfig = subcategoryIconResolver(subSubcategoryId, subSubcategory.name, selected);

                return (
                  <OptionCard
                    key={subSubcategoryId}
                    id={subSubcategoryId}
                    name={subSubcategory.name}
                    description="Specialized assistance approach"
                    isSelected={selected}
                    onClick={() => selectSubSubcategory(subSubcategoryId)}
                    icon={iconConfig.component}
                    iconColor={iconConfig.color}
                    badges={subSubcategory.options?.slice(0, 3) || []}
                  />
                );
              })}
            </SelectionGrid>
          </div>
        )}

        {/* Selection Summary */}
        {wizardState.subcategory && wizardState.subSubcategory && (
          <ProgressSummary
            title="Support Focus Confirmed"
            items={[
              {
                label: "Category",
                value: categoryData.name
              },
              {
                label: "Focus",
                value: (categoryData.subcategories as any)[wizardState.subcategory].name
              },
              {
                label: "Approach",
                value: (categoryData.subcategories as any)[wizardState.subcategory]
                  .subSubcategories[wizardState.subSubcategory].name
              }
            ]}
          />
        )}
      </div>
    </WizardLayout>
  );
};
