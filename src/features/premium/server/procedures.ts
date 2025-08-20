import { eq, count } from "drizzle-orm";

import { agents, conversations, sessions } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { MAX_FREE_AGENTS, MAX_FREE_CONVERSATIONS, MAX_FREE_SESSIONS } from "@/constants/premium";

export const premiumRouter = createTRPCRouter({
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });

    const subscription = customer.activeSubscriptions[0];

    if (!subscription) {
      return null;
    }

    const product = await polarClient.products.get({
      id: subscription.productId,
    });

    return product;
  }),

  getProducts: protectedProcedure.query(async () => {
    const products = await polarClient.products.list({
      isArchived: false,
      isRecurring: true,
      sorting: ["price_amount"],
    });

    return products.result.items;
  }),

  getUsageAndLimits: protectedProcedure.query(async ({ ctx }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });

    // Get all counts concurrently for better performance
    const [agentCount, sessionCount, conversationCount] = await Promise.all([
      ctx.db
        .select({ count: count(agents.id) })
        .from(agents)
        .where(eq(agents.userId, ctx.auth.user.id))
        .then(([row]) => row.count),
      ctx.db
        .select({ count: count(sessions.id) })
        .from(sessions)
        .where(eq(sessions.userId, ctx.auth.user.id))
        .then(([row]) => row.count),
      ctx.db
        .select({ count: count(conversations.id) })
        .from(conversations)
        .where(eq(conversations.userId, ctx.auth.user.id))
        .then(([row]) => row.count),
    ]);

    // Default limits for free tier (single source of truth)
    const defaultLimits = {
      agents: MAX_FREE_AGENTS,
      sessions: MAX_FREE_SESSIONS,
      conversations: MAX_FREE_CONVERSATIONS,
    } as const;

    // If no benefits, return default limits with counts
    if (customer.grantedBenefits.length === 0) {
      return {
        agents: { count: agentCount, limit: defaultLimits.agents },
        sessions: { count: sessionCount, limit: defaultLimits.sessions },
        conversations: { count: conversationCount, limit: defaultLimits.conversations },
      } as const;
    }

    // Resolve benefits concurrently and compute limits per resource
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
      agents: { count: agentCount, limit: limitsFromBenefits.agents ?? defaultLimits.agents },
      sessions: { count: sessionCount, limit: limitsFromBenefits.sessions ?? defaultLimits.sessions },
      conversations: { count: conversationCount, limit: limitsFromBenefits.conversations ?? defaultLimits.conversations },
    } as const;
  }),
});

