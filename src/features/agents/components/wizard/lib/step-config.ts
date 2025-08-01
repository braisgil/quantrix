import { Bot, Target, Network, Zap, Settings } from "lucide-react";
import type { StepConfig } from "../types/wizard";

export const STEP_CONFIGS: StepConfig[] = [
  {
    id: 0,
    name: "Getting Started",
    description: "Choose a name for your companion",
    icon: Bot
  },
  {
    id: 1,
    name: "Purpose & Focus",
    description: "What kind of support do you need?",
    icon: Target
  },
  {
    id: 2,
    name: "Personalization",
    description: "Tailor your companion's approach",
    icon: Network
  },
  {
    id: 3,
    name: "Specialization",
    description: "Define specific areas of help",
    icon: Zap
  },
  {
    id: 4,
    name: "Personality",
    description: "Set communication style and tone",
    icon: Settings
  }
];

export const getStepConfig = (stepIndex: number): StepConfig => {
  return STEP_CONFIGS[stepIndex] || STEP_CONFIGS[0];
};

export const getTotalSteps = (): number => STEP_CONFIGS.length;
