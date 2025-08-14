import { useMemo } from "react";
import type { ConversationWizardState, StepValidationConfig } from "../types/wizard";

const stepValidationConfig: StepValidationConfig = {
  0: (state: ConversationWizardState) => {
    // Validate conversation details step
    if (!state.name.trim() || !state.agentId) return false;
    // If scheduled, date and time are required. If not scheduled, no date/time needed
    if (state.isScheduled) {
      return Boolean(state.scheduledDate && state.scheduledTime);
    }
    return true;
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