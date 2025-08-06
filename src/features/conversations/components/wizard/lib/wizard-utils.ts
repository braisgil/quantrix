import type { ConversationWizardState } from "../types/wizard";

export const getProgressPercentage = (currentStep: number, totalSteps: number) => {
  return ((currentStep + 1) / totalSteps) * 100;
};

export const formatDateTime = (date: Date, time: string) => {
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `${dateStr} at ${time}`;
};

export const getFormData = (wizardState: ConversationWizardState) => {
  const { name, sessionId, agentId, scheduledDate, scheduledTime } = wizardState;
  
  // Combine date and time into a single datetime
  let scheduledDateTime: Date | undefined = undefined;
  if (scheduledDate && scheduledTime) {
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    scheduledDateTime = new Date(scheduledDate);
    scheduledDateTime.setHours(hours, minutes, 0, 0);
  }
  
  return {
    name,
    sessionId: sessionId!,
    agentId: agentId!,
    scheduledDateTime,
  };
}; 