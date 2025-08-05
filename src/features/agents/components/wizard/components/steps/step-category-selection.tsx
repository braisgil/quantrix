import { Target } from "lucide-react";
import { AGENT_CATEGORIES } from "@/constants/agent-categories";
import { WizardLayout } from "../shared/wizard-layout";
import { SelectionGrid } from "../shared/selection-grid";
import { OptionCard } from "../shared/option-card";
import type { StepProps, AgentCategoryId } from "../../types/wizard";
import { useSelectionState } from "../../hooks/use-selection-state";
import { categoryIconResolver } from "../../lib/icon-mappings";

export const StepCategorySelection = ({ wizardState, updateWizardState }: StepProps) => {
  const { selectCategory, isSelected } = useSelectionState({ wizardState, updateWizardState });

  const categoryEntries = Object.entries(AGENT_CATEGORIES);

  return (
    <WizardLayout
      title="Choose Your Support Area"
      description="Select the main area where you'd like your AI companion to help you"
      icon={Target}
    >
      <div className="space-y-6">
        {/* Category Selection Grid */}
        <SelectionGrid columns="2">
          {categoryEntries.map(([categoryId, category]) => {
            const selected = isSelected.category(categoryId as AgentCategoryId);
            const iconConfig = categoryIconResolver(categoryId, category.name, selected);
            const subcategoryNames = Object.values(category.subcategories).map(sub => sub.name);

            return (
              <OptionCard
                key={categoryId}
                id={categoryId}
                name={category.name}
                description={category.description}
                isSelected={selected}
                onClick={() => selectCategory(categoryId as AgentCategoryId)}
                icon={iconConfig.component}
                iconColor={iconConfig.color}
                badges={subcategoryNames}
              />
            );
          })}
        </SelectionGrid>
      </div>
    </WizardLayout>
  );
};
