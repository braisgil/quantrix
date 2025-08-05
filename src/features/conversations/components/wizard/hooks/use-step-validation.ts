import { useMemo } from "react";
import type { ConversationWizardState, StepValidationConfig } from "../types/wizard";

const stepValidationConfig: StepValidationConfig = {
  0: (state: ConversationWizardState) => {
    // Validate conversation details step
    return Boolean(
      state.name.trim() &&
      state.agentId &&
      state.scheduledDate &&
      state.scheduledTime
    );
  },
};

export const useStepValidation = (wizardState: ConversationWizardState) => {
  const validationResults = useMemo(() => {
    const results: Record<number, boolean> = {};
    
    Object.entries(stepValidationConfig).forEach(([stepIndex, validationFn]) => {
      results[Number(stepIndex)] = validationFn(wizardState);
    });
    
    return results;
  }, [wizardState]);

  const canProceed = (stepIndex: number): boolean => {
    return validationResults[stepIndex] ?? false;
  };

  const canSubmit = (stepIndex: number): boolean => {
    return canProceed(stepIndex);
  };

  return {
    canProceed,
    canSubmit,
    validationResults,
  };
}; 