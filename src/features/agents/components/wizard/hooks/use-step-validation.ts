import { useMemo } from "react";
import type { WizardState, StepValidationConfig } from "../types/wizard";

/**
 * Hook for step validation logic
 */
export const useStepValidation = (wizardState: WizardState) => {
  const validationConfig: StepValidationConfig = useMemo(() => ({
    0: (state) => state.name.trim().length > 0,
    1: (state) => state.category !== null,
    2: (state) => state.subcategory !== null && state.subSubcategory !== null,
    3: (state) => state.specificOption !== null,
    4: (state) => state.customRule1 !== null && state.customRule2 !== null, // Predefined rules required, additional rules optional
  }), []);

  const canProceed = (step: number): boolean => {
    const validator = validationConfig[step];
    return validator ? validator(wizardState) : false;
  };

  const getValidationErrors = (step: number): string[] => {
    const errors: string[] = [];
    
    switch (step) {
      case 0:
        if (!wizardState.name.trim()) {
          errors.push("Please enter a name for your companion");
        }
        break;
      case 1:
        if (!wizardState.category) {
          errors.push("Please select a support area");
        }
        break;
      case 2:
        if (!wizardState.subcategory) {
          errors.push("Please select a focus area");
        }
        if (!wizardState.subSubcategory) {
          errors.push("Please refine your choice");
        }
        break;
      case 3:
        if (!wizardState.specificOption) {
          errors.push("Please choose your specific focus");
        }
        break;
      case 4:
        if (!wizardState.customRule1) {
          errors.push("Please select a communication style");
        }
        if (!wizardState.customRule2) {
          errors.push("Please select a learning approach");
        }
        // Additional rules are optional
        break;
    }
    
    return errors;
  };

  return {
    canProceed,
    getValidationErrors,
    isStepValid: (step: number) => canProceed(step),
    hasErrors: (step: number) => getValidationErrors(step).length > 0,
  };
};
