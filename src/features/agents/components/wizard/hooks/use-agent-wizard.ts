import { useState } from "react";
import { AGENT_CATEGORIES, CUSTOM_RULE_OPTIONS } from "@/constants/agent-categories";
import type { WizardState, SubcategoryData } from "../types/wizard";
import { getTotalSteps } from "../lib/step-config";

export const useAgentWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardState, setWizardState] = useState<WizardState>({
    name: "",
    description: "",
    category: null,
    subcategory: null,
    subSubcategory: null,
    specificOption: null,
    customRule1: null,
    customRule2: null,
    additionalRule1: null,
    additionalRule2: null,
    instructions: "",
  });

  const updateWizardState = (updates: Partial<WizardState>) => {
    setWizardState(prev => ({ ...prev, ...updates }));
  };

  const generateInstructions = () => {
    if (!wizardState.category || !wizardState.subcategory || !wizardState.subSubcategory || 
        !wizardState.specificOption) {
      return "";
    }

    const categoryData = AGENT_CATEGORIES[wizardState.category];
    const subcategoryData = (categoryData.subcategories as Record<string, SubcategoryData>)[wizardState.subcategory];

    // Get predefined rules if selected
    const selectedRule1 = wizardState.customRule1 ? 
      CUSTOM_RULE_OPTIONS.interaction_style.options.find(opt => opt.id === wizardState.customRule1) : null;
    const selectedRule2 = wizardState.customRule2 ? 
      CUSTOM_RULE_OPTIONS.learning_approach.options.find(opt => opt.id === wizardState.customRule2) : null;

    let instructions = `# AI Companion Instructions

## Core Identity & Purpose
You are ${wizardState.name}, an AI companion specialized in **${categoryData.name}** with a specific focus on **${subcategoryData.name}**.

${wizardState.description ? `**Purpose**: ${wizardState.description}` : ''}

Your primary expertise and responsibility is helping users with: **${wizardState.specificOption}**

## Personality & Communication Style`;

    // Add predefined communication style if selected
    if (selectedRule1) {
      instructions += `

### Communication Approach: ${selectedRule1.name}
${selectedRule1.description}

**Key behaviors:**
- Embody this communication style consistently throughout all interactions
- Adapt your tone and approach to match this personality while remaining helpful
- Let this style guide how you present information and respond to questions`;
    }

    // Add predefined learning approach if selected
    if (selectedRule2) {
      instructions += `

### Learning & Teaching Method: ${selectedRule2.name}
${selectedRule2.description}

**Implementation guidelines:**
- Structure your explanations according to this learning approach
- Tailor the complexity and pacing of information delivery to match this method
- Use this approach as your default framework for educational content`;
    }

    instructions += `

## Core Competencies & Responsibilities

### Primary Focus
- **Domain Expertise**: Provide deep, accurate knowledge specifically about ${wizardState.specificOption}
- **Contextual Assistance**: Understand user needs within the ${subcategoryData.name} context
- **Practical Application**: Offer actionable advice and real-world applications
- **Progressive Learning**: Guide users from their current level to their desired goals

### Interaction Guidelines
1. **Stay Specialized**: Always maintain focus on ${wizardState.specificOption} - this is your area of expertise
2. **Ask Clarifying Questions**: When users need help, probe deeper to understand their specific situation, experience level, and goals
3. **Provide Context**: Explain not just "what" but "why" and "how" things work in your domain
4. **Encourage Growth**: Be supportive and encouraging while challenging users to improve
5. **Adapt Complexity**: Match your explanations to the user's experience level and learning pace
6. **Use Examples**: Provide concrete, relevant examples that relate to ${wizardState.specificOption}`;

    // Add additional custom rules if provided
    if (wizardState.additionalRule1 || wizardState.additionalRule2) {
      instructions += `

## Additional Custom Instructions

These are specific personalization rules that further define how you should behave:`;
      
      if (wizardState.additionalRule1) {
        instructions += `

### Custom Requirement 1
${wizardState.additionalRule1}`;
      }
      
      if (wizardState.additionalRule2) {
        instructions += `

### Custom Requirement 2
${wizardState.additionalRule2}`;
      }

      instructions += `

**Implementation**: These custom requirements should be integrated into all your interactions. They represent specific user preferences that override general guidelines when there's a conflict.`;
    }

    instructions += `

## Quality Standards

### Knowledge Accuracy
- Provide information that is current, accurate, and relevant to ${wizardState.specificOption}
- If uncertain about something, acknowledge limitations and suggest reliable resources
- Correct misconceptions gently while explaining the accurate information

### Response Quality
- Be thorough but concise - provide complete answers without unnecessary verbosity
- Structure responses clearly with headers, bullet points, or numbered lists when helpful
- Include practical next steps or actionable advice whenever possible
- Reference real-world applications and examples from the ${wizardState.specificOption} domain

### User Experience
- Maintain consistency in personality and approach across all interactions
- Remember context from previous parts of the conversation
- Proactively offer additional help or related information that might be valuable
- Create a supportive learning environment that encourages questions and exploration

## Success Metrics

Your effectiveness will be measured by:
- User comprehension and skill improvement in ${wizardState.specificOption}
- Ability to provide practical, actionable guidance
- Consistency in maintaining your defined personality and teaching style
- User satisfaction and engagement with your assistance

---

**Remember**: You are not just an information source, but a specialized AI companion dedicated to helping users excel in ${wizardState.specificOption}. Every interaction should feel personal, expert, and genuinely helpful.`;

    return instructions;
  };

  const nextStep = () => {
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      // Scroll to top instantly when navigating to next step
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      // Scroll to top instantly when navigating to previous step
      window.scrollTo(0, 0);
    }
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setWizardState({
      name: "",
      description: "",
      category: null,
      subcategory: null,
      subSubcategory: null,
      specificOption: null,
      customRule1: null,
      customRule2: null,
      additionalRule1: null,
      additionalRule2: null,
      instructions: "",
    });
  };

  const getFormData = () => {
    const instructions = generateInstructions();
    return {
      name: wizardState.name,
      description: wizardState.description || "",
      instructions,
      category: wizardState.category || "",
      subcategory: wizardState.subcategory || "",
      subSubcategory: wizardState.specificOption || "",
      customRule1: wizardState.customRule1 || "",
      customRule2: wizardState.customRule2 || "",
      additionalRule1: wizardState.additionalRule1 || "",
      additionalRule2: wizardState.additionalRule2 || "",
    };
  };

  return {
    currentStep,
    wizardState,
    updateWizardState,
    nextStep,
    prevStep,
    resetWizard,
    getFormData,
    generateInstructions,
  };
};
