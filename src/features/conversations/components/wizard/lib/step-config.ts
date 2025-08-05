import { MessageSquare } from "lucide-react";
import type { StepConfig } from "../types/wizard";

export const STEP_CONFIGS: StepConfig[] = [
  {
    id: 0,
    name: "Conversation Details",
    description: "Set up your conversation with an AI companion",
    icon: MessageSquare,
  },
];

export const getTotalSteps = () => STEP_CONFIGS.length;

export const getProgressPercentage = (currentStep: number, totalSteps: number) => {
  return ((currentStep + 1) / totalSteps) * 100;
}; 