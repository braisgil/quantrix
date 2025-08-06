import { useMemo } from "react";
import type { SessionWizardState } from "../types/wizard";

export const useStepValidation = (wizardState: SessionWizardState) => {
  const canProceed = useMemo(() => {
    return (step: number): boolean => {
      switch (step) {
        case 0: // Session Details Step
          return !!(
            wizardState.name &&
            wizardState.name.trim().length > 0 &&
            wizardState.agentId &&
            wizardState.agentId.trim().length > 0
          );
        default:
          return false;
      }
    };
  }, [wizardState]);

  return { canProceed };
};