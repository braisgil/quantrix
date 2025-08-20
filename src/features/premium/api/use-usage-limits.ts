import { MAX_FREE_AGENTS, MAX_FREE_CONVERSATIONS, MAX_FREE_SESSIONS } from "@/constants/premium";
import { useQueryUsage } from "./use-query-usage";

export const useUsageLimits = () => {
  const { data: { agents, sessions, conversations } } = useQueryUsage();

  const counts = {
    agents: agents?.count ?? 0,
    sessions: sessions?.count ?? 0,
    conversations: conversations?.count ?? 0,
  } as const;

  const limits = {
    agents: agents?.limit ?? MAX_FREE_AGENTS,
    sessions: sessions?.limit ?? MAX_FREE_SESSIONS,
    conversations: conversations?.limit ?? MAX_FREE_CONVERSATIONS,
  } as const;

  const reached = {
    agents: counts.agents >= limits.agents,
    sessions: counts.sessions >= limits.sessions,
    conversations: counts.conversations >= limits.conversations,
  } as const;

  const canCreate = {
    agents: !reached.agents,
    sessions: !reached.sessions,
    conversations: !reached.conversations,
  } as const;

  return {
    counts,
    limits,
    reached,
    canCreate,
  } as const;
};


