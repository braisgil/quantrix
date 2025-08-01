import { useCallback } from "react";
import type { WizardState, AgentCategoryId } from "../types/wizard";

interface UseSelectionStateProps {
  wizardState: WizardState;
  updateWizardState: (updates: Partial<WizardState>) => void;
}

/**
 * Hook for managing selection state across wizard steps
 */
export const useSelectionState = ({ wizardState, updateWizardState }: UseSelectionStateProps) => {
  
  const selectCategory = useCallback((categoryId: AgentCategoryId) => {
    updateWizardState({ 
      category: categoryId,
      subcategory: null,
      subSubcategory: null,
      specificOption: null
    });
  }, [updateWizardState]);

  const selectSubcategory = useCallback((subcategoryId: string) => {
    updateWizardState({ 
      subcategory: subcategoryId,
      subSubcategory: null,
      specificOption: null
    });
  }, [updateWizardState]);

  const selectSubSubcategory = useCallback((subSubcategoryId: string) => {
    updateWizardState({ 
      subSubcategory: subSubcategoryId,
      specificOption: null
    });
  }, [updateWizardState]);

  const selectSpecificOption = useCallback((option: string) => {
    updateWizardState({ specificOption: option });
  }, [updateWizardState]);

  const selectCustomRule1 = useCallback((ruleId: string) => {
    updateWizardState({ customRule1: ruleId });
  }, [updateWizardState]);

  const selectCustomRule2 = useCallback((ruleId: string) => {
    updateWizardState({ customRule2: ruleId });
  }, [updateWizardState]);

  const updateName = useCallback((name: string) => {
    updateWizardState({ name });
  }, [updateWizardState]);

  return {
    selectCategory,
    selectSubcategory,
    selectSubSubcategory,
    selectSpecificOption,
    selectCustomRule1,
    selectCustomRule2,
    updateName,
    
    // Selection checks
    isSelected: {
      category: (id: AgentCategoryId) => wizardState.category === id,
      subcategory: (id: string) => wizardState.subcategory === id,
      subSubcategory: (id: string) => wizardState.subSubcategory === id,
      specificOption: (option: string) => wizardState.specificOption === option,
      customRule1: (id: string) => wizardState.customRule1 === id,
      customRule2: (id: string) => wizardState.customRule2 === id,
    },
  };
};
