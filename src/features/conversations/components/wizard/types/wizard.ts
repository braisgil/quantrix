export interface ConversationWizardState {
  // Basic info
  name: string;
  
  // Session and agent selection
  sessionId: string | null;
  agentId: string | null;
  
  // Date and time
  isScheduled: boolean;
  scheduledDate: Date | null;
  scheduledTime: string | null;
}

export interface StepProps {
  wizardState: ConversationWizardState;
  updateWizardState: (updates: Partial<ConversationWizardState>) => void;
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

export type ValidationFunction = (state: ConversationWizardState) => boolean;

export interface StepValidationConfig {
  [stepIndex: number]: ValidationFunction;
}

export interface AgentOption {
  id: string;
  name: string;
  description?: string;
  category?: string;
} 