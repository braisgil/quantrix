import { count, eq } from "drizzle-orm";
import { agents, conversations, sessions } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import { MAX_FREE_AGENTS, MAX_FREE_CONVERSATIONS, MAX_FREE_SESSIONS } from "@/constants/premium";
import type { db as dbInstance } from "@/db";

type Database = typeof dbInstance;

export const getDefaultLimits = () => ({
  agents: MAX_FREE_AGENTS,
  sessions: MAX_FREE_SESSIONS,
  conversations: MAX_FREE_CONVERSATIONS,
} as const);

export const getUsageCounts = async (db: Database, userId: string) => {
  const [agentCount, sessionCount, conversationCount] = await Promise.all([
    db
      .select({ count: count(agents.id) })
      .from(agents)
      .where(eq(agents.userId, userId))
      .then(([row]) => row.count),
    db
      .select({ count: count(sessions.id) })
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .then(([row]) => row.count),
    db
      .select({ count: count(conversations.id) })
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .then(([row]) => row.count),
  ]);

  return { agentCount, sessionCount, conversationCount } as const;
};

export const computePlanLimitsForCustomer = async (
  customer: { grantedBenefits: Array<{ benefitId: string }>; activeSubscriptions: unknown[] },
  defaults: { agents: number; sessions: number; conversations: number }
) => {
  if (customer.grantedBenefits.length === 0) {
    return defaults;
  }

  const benefitDetailsList = await Promise.all(
    customer.grantedBenefits.map((b) => polarClient.benefits.get({ id: b.benefitId }))
  );

  const limitsFromBenefits = benefitDetailsList.reduce<{
    agents: number | undefined;
    sessions: number | undefined;
    conversations: number | undefined;
  }>((acc, benefit) => {
    const [limitStr, resourceType = ""] = benefit.description.split(" ");
    const parsed = parseInt(limitStr, 10);
    const limit = Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
    const key = resourceType.toLowerCase();
    if (key === "agents") acc.agents = Math.max(acc.agents ?? 0, limit ?? 0) || acc.agents;
    if (key === "sessions") acc.sessions = Math.max(acc.sessions ?? 0, limit ?? 0) || acc.sessions;
    if (key === "conversations") acc.conversations = Math.max(acc.conversations ?? 0, limit ?? 0) || acc.conversations;
    return acc;
  }, { agents: undefined, sessions: undefined, conversations: undefined });

  return {
    agents: limitsFromBenefits.agents ?? defaults.agents,
    sessions: limitsFromBenefits.sessions ?? defaults.sessions,
    conversations: limitsFromBenefits.conversations ?? defaults.conversations,
  } as const;
};


