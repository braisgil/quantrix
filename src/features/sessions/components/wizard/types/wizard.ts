export interface SessionWizardState {
  name: string;
  description: string;
  agentId: string;
}

export interface StepProps {
  wizardState: SessionWizardState;
  updateWizardState: (updates: Partial<SessionWizardState>) => void;
}