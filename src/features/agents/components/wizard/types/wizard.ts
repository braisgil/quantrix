import type { AgentCategoryId } from "@/constants/agent-categories";

export type { AgentCategoryId };

export interface WizardState {
  // Basic info
  name: string;
  description: string;
  
  // Category selection
  category: AgentCategoryId | null;
  subcategory: string | null;
  subSubcategory: string | null;
  specificOption: string | null;
  
  // Predefined custom rules
  customRule1: string | null;
  customRule2: string | null;
  
  // Additional free text custom rules
  additionalRule1: string | null;
  additionalRule2: string | null;
  
  // Generated instructions
  instructions: string;
}

export interface StepProps {
  wizardState: WizardState;
  updateWizardState: (updates: Partial<WizardState>) => void;
}

export interface StepConfig {
  id: number;
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface OptionCardProps {
  id: string;
  name: string;
  description?: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor?: string;
  badges?: string[];
  className?: string;
}

export interface StepHeaderProps {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface SelectionGridProps {
  children: React.ReactNode;
  columns?: "1" | "2" | "3";
  className?: string;
}

export interface ProgressSummaryProps {
  title: string;
  items: Array<{
    label: string;
    value: string;
  }>;
  className?: string;
}

export type ValidationFunction = (state: WizardState) => boolean;

export interface StepValidationConfig {
  [stepIndex: number]: ValidationFunction;
}

export interface CategoryData {
  id: string;
  name: string;
  description: string;
  subcategories: Record<string, SubcategoryData>;
}

export interface SubcategoryData {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly subSubcategories: Record<string, SubSubcategoryData>;
}

export interface SubSubcategoryData {
  readonly id: string;
  readonly name: string;
  readonly options: readonly string[];
}

export interface CustomRuleOption {
  id: string;
  name: string;
  description: string;
}

export interface CustomRuleCategory {
  name: string;
  description: string;
  options: CustomRuleOption[];
}
