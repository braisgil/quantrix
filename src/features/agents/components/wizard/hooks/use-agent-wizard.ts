import { useState } from "react";
import { AGENT_CATEGORIES, CUSTOM_RULE_OPTIONS } from "@/constants/agent-categories";
import type { WizardState, AgentCategoryId } from "../types/wizard";
import { getTotalSteps } from "../lib/step-config";
import { validateStep } from "../lib/wizard-utils";

export const useAgentWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardState, setWizardState] = useState<WizardState>({
    name: "",
    category: null,
    subcategory: null,
    subSubcategory: null,
    specificOption: null,
    customRule1: null,
    customRule2: null,
    instructions: "",
  });

  const updateWizardState = (updates: Partial<WizardState>) => {
    setWizardState(prev => ({ ...prev, ...updates }));
  };

  const generateInstructions = () => {
    if (!wizardState.category || !wizardState.subcategory || !wizardState.subSubcategory || 
        !wizardState.specificOption || !wizardState.customRule1 || !wizardState.customRule2) {
      return "";
    }

    const categoryData = AGENT_CATEGORIES[wizardState.category];
    const subcategoryData = (categoryData.subcategories as any)[wizardState.subcategory];
    const subSubcategoryData = (subcategoryData.subSubcategories as any)[wizardState.subSubcategory];

    const rule1 = CUSTOM_RULE_OPTIONS.interaction_style.options.find(opt => opt.id === wizardState.customRule1);
    const rule2 = CUSTOM_RULE_OPTIONS.learning_approach.options.find(opt => opt.id === wizardState.customRule2);

    return `You are an AI agent specialized in ${categoryData.name} with focus on ${subcategoryData.name}.

Specifically, you help users with: ${wizardState.specificOption}

Your communication style should be: ${rule1?.name} - ${rule1?.description}

Your content approach should be: ${rule2?.name} - ${rule2?.description}

Guidelines:
- Always stay focused on the chosen specialization: ${wizardState.specificOption}
- Adapt your responses to match the specified communication style
- Structure your content according to the chosen approach
- Provide practical, actionable advice when appropriate
- Be encouraging and supportive while maintaining your style
- Ask clarifying questions to better understand the user's specific needs within this domain

Remember: You are an expert in ${wizardState.specificOption} and should provide valuable, specialized assistance in this area.`;
  };

  const nextStep = () => {
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setWizardState({
      name: "",
      category: null,
      subcategory: null,
      subSubcategory: null,
      specificOption: null,
      customRule1: null,
      customRule2: null,
      instructions: "",
    });
  };

  const getFormData = () => {
    const instructions = generateInstructions();
    return {
      name: wizardState.name,
      instructions,
      category: wizardState.category || "",
      subcategory: wizardState.subcategory || "",
      subSubcategory: wizardState.specificOption || "",
      customRule1: wizardState.customRule1 || "",
      customRule2: wizardState.customRule2 || "",
    };
  };

  const canProceed = (step: number): boolean => {
    return validateStep(step, wizardState);
  };

  return {
    currentStep,
    wizardState,
    updateWizardState,
    nextStep,
    prevStep,
    resetWizard,
    getFormData,
    canProceed,
    generateInstructions,
  };
};
