import { MAX_FREE_AGENTS, MAX_FREE_CONVERSATIONS, MAX_FREE_SESSIONS } from "@/constants/premium";
import { useQueryUsage } from "./use-query-usage";

export const useUsageLimits = () => {
  const query = useQueryUsage();
  const usage = query.data; // null for paid tiers

  const isFreeTier = usage !== null;

  const counts = {
    agents: usage?.agentCount ?? 0,
    sessions: usage?.sessionCount ?? 0,
    conversations: usage?.conversationCount ?? 0,
  } as const;

  const limits = {
    agents: MAX_FREE_AGENTS,
    sessions: MAX_FREE_SESSIONS,
    conversations: MAX_FREE_CONVERSATIONS,
  } as const;

  const reached = {
    agents: isFreeTier && counts.agents >= limits.agents,
    sessions: isFreeTier && counts.sessions >= limits.sessions,
    conversations: isFreeTier && counts.conversations >= limits.conversations,
  } as const;

  const canCreate = {
    agents: !reached.agents,
    sessions: !reached.sessions,
    conversations: !reached.conversations,
  } as const;

  return {
    ...query,
    isFreeTier,
    counts,
    limits,
    reached,
    canCreate,
  } as const;
};


