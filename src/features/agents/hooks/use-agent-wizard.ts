import { useState } from "react";
import { AGENT_CATEGORIES, CUSTOM_RULE_OPTIONS } from "@/constants/agent-categories";
import type { AgentCategoryId } from "@/constants/agent-categories";

export type { AgentCategoryId };

export interface WizardState {
  // Basic info
  name: string;
  
  // Category selection
  category: AgentCategoryId | null;
  subcategory: string | null;
  subSubcategory: string | null;
  specificOption: string | null;
  
  // Custom rules
  customRule1: string | null;
  customRule2: string | null;
  
  // Generated instructions
  instructions: string;
}

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
    const subcategoryData = categoryData.subcategories[wizardState.subcategory];
    const subSubcategoryData = subcategoryData.subSubcategories[wizardState.subSubcategory];

    const rule1 = CUSTOM_RULE_OPTIONS.interaction_style.options.find(opt => opt.id === wizardState.customRule1);
    const rule2 = CUSTOM_RULE_OPTIONS.content_focus.options.find(opt => opt.id === wizardState.customRule2);

    return `You are an AI agent specialized in ${categoryData.name.replace(/🎓|🎭|💼|💚/g, '').trim()} with focus on ${subcategoryData.name.replace(/🌍|💻|📚|🎨|🎮|🎯|📈|🚀|🧠|💪|🌱/g, '').trim()}.

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
    if (currentStep < 4) {
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
    switch (step) {
      case 0: return wizardState.name.trim().length > 0;
      case 1: return wizardState.category !== null;
      case 2: return wizardState.subcategory !== null && wizardState.subSubcategory !== null;
      case 3: return wizardState.specificOption !== null;
      case 4: return wizardState.customRule1 !== null && wizardState.customRule2 !== null;
      default: return false;
    }
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