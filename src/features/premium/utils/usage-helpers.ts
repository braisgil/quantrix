import { MAX_FREE_AGENTS, MAX_FREE_SESSIONS, MAX_FREE_CONVERSATIONS } from "@/constants/premium";
import type { PremiumUsage } from "../types";

export interface UsageMetrics {
  agents: { countLabel: string; progress: number };
  sessions: { countLabel: string; progress: number };
  conversations: { countLabel: string; progress: number };
}

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

export const getUsageMetrics = ({agents, sessions, conversations}: NonNullable<PremiumUsage>): UsageMetrics => {
  const agentCount = agents?.count ?? 0;
  const sessionCount = sessions?.count ?? 0;
  const conversationCount = conversations?.count ?? 0;

  const agentLimit = agents?.limit ?? MAX_FREE_AGENTS;
  const sessionLimit = sessions?.limit ?? MAX_FREE_SESSIONS;
  const conversationLimit = conversations?.limit ?? MAX_FREE_CONVERSATIONS;

  return {
    agents: {
      countLabel: `${agentCount}/${agentLimit}`,
      progress: clampPercent((agentCount / agentLimit) * 100),
    },
    sessions: {
      countLabel: `${sessionCount}/${sessionLimit}`,
      progress: clampPercent((sessionCount / sessionLimit) * 100),
    },
    conversations: {
      countLabel: `${conversationCount}/${conversationLimit}`,
      progress: clampPercent((conversationCount / conversationLimit) * 100),
    },
  };
};


