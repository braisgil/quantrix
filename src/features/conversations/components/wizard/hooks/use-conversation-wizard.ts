import { useState } from "react";
import type { ConversationWizardState } from "../types/wizard";
import { getTotalSteps } from "../lib/step-config";
import { getFormData } from "../lib/wizard-utils";

interface UseConversationWizardProps {
  agentId: string;
}

export const useConversationWizard = ({ agentId }: UseConversationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardState, setWizardState] = useState<ConversationWizardState>({
    name: "",
    agentId: agentId,
    scheduledDate: null,
    scheduledTime: null,
  });

  const updateWizardState = (updates: Partial<ConversationWizardState>) => {
    setWizardState(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setWizardState({
      name: "",
      agentId: null,
      scheduledDate: null,
      scheduledTime: null,
    });
  };

  const getFormDataForSubmission = () => {
    return getFormData(wizardState);
  };

  return {
    currentStep,
    wizardState,
    updateWizardState,
    nextStep,
    prevStep,
    resetWizard,
    getFormData: getFormDataForSubmission,
  };
}; 