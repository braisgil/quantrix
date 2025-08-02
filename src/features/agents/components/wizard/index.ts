// Main wizard component
export { AgentWizard } from './components/AgentWizard';

// Step components
export { StepBasicInfo } from './components/steps/StepBasicInfo';
export { StepCategorySelection } from './components/steps/StepCategorySelection';
export { StepSubcategorySelection } from './components/steps/StepSubcategorySelection';
export { StepSpecificOption } from './components/steps/StepSpecificOption';
export { StepCustomRules } from './components/steps/StepCustomRules';

// Shared components
export { StepHeader } from './components/shared/StepHeader';
export { OptionCard } from './components/shared/OptionCard';
export { SelectionGrid } from './components/shared/SelectionGrid';
export { ProgressSummary } from './components/shared/ProgressSummary';
export { WizardLayout } from './components/shared/WizardLayout';

// Hooks
export { useAgentWizard } from './hooks/use-agent-wizard';
export { useStepValidation } from './hooks/use-step-validation';
export { useSelectionState } from './hooks/use-selection-state';

// Types
export type { 
  WizardState, 
  StepProps, 
  AgentCategoryId,
  OptionCardProps,
  StepHeaderProps,
  SelectionGridProps,
  ProgressSummaryProps
} from './types/wizard';

export type {
  IconComponent,
  IconConfig,
  IconResolver
} from './types/mappings';

// Utilities
export { 
  getIconConfig,
  categoryIconResolver,
  subcategoryIconResolver,
  specificOptionIconResolver,
  customRuleIconResolver
} from './lib/icon-mappings';

export {
  getGridClasses,
  getCardClasses,
  getIconContainerClasses,
  getTitleClasses,
  getDescriptionClasses,
  getBadgeClasses,
  getAnimationClasses,
  validateStep,
  getProgressPercentage
} from './lib/wizard-utils';

export { STEP_CONFIGS, getStepConfig, getTotalSteps } from './lib/step-config';
 