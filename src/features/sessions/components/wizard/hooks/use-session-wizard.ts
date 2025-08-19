import { useState, useCallback } from "react";
import type { SessionWizardState } from "../types/wizard";
import type { SessionsInsertSchema } from "../../../schema";

const initialWizardState: SessionWizardState = {
  name: "",
  description: "",
  agentId: "",
};

export const useSessionWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardState, setWizardState] = useState<SessionWizardState>(initialWizardState);

  const updateWizardState = useCallback((updates: Partial<SessionWizardState>) => {
    setWizardState((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 0)); // Only one step for now
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const getFormData = useCallback((): SessionsInsertSchema => {
    return {
      name: wizardState.name,
      description: wizardState.description || null,
      agentId: wizardState.agentId,
    };
  }, [wizardState]);

  return {
    currentStep,
    wizardState,
    updateWizardState,
    nextStep,
    prevStep,
    getFormData,
  };
};