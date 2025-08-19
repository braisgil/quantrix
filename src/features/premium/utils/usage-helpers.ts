import { MAX_FREE_AGENTS, MAX_FREE_SESSIONS, MAX_FREE_CONVERSATIONS } from "@/constants/premium";
import type { PremiumUsage } from "../types";

export interface FreeTierUsageMetrics {
  agents: { countLabel: string; progress: number };
  sessions: { countLabel: string; progress: number };
  conversations: { countLabel: string; progress: number };
}

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

export const getFreeUsageMetrics = (usage: NonNullable<PremiumUsage>): FreeTierUsageMetrics => {
  const agentCount = usage.agentCount;
  const sessionCount = usage.sessionCount;
  const conversationCount = usage.conversationCount;

  return {
    agents: {
      countLabel: `${agentCount}/${MAX_FREE_AGENTS}`,
      progress: clampPercent((agentCount / MAX_FREE_AGENTS) * 100),
    },
    sessions: {
      countLabel: `${sessionCount}/${MAX_FREE_SESSIONS}`,
      progress: clampPercent((sessionCount / MAX_FREE_SESSIONS) * 100),
    },
    conversations: {
      countLabel: `${conversationCount}/${MAX_FREE_CONVERSATIONS}`,
      progress: clampPercent((conversationCount / MAX_FREE_CONVERSATIONS) * 100),
    },
  };
};


