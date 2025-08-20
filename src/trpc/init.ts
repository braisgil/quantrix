import { auth } from '@/lib/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { LRUCache } from 'lru-cache';
import { headers } from 'next/headers';
import { cache } from 'react';
import { db } from '@/db';
import { polarClient } from '@/lib/polar';
import { getDefaultLimits, getUsageCounts, computePlanLimitsForCustomer } from '@/features/premium/server/plan-limits';

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return { 
    session,
    db, // Database connection - standard practice
  };
});

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createTRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const createMiddleware = t.middleware;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  return next({ ctx: { ...ctx, auth: ctx.session } });
});

export const premiumProcedure = (entity: 'agents' | 'sessions' | 'conversations') =>
  protectedProcedure.use(async ({ ctx, next }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });

    const { agentCount, sessionCount, conversationCount } = await getUsageCounts(ctx.db, ctx.auth.user.id);

    const defaultLimits = getDefaultLimits();
    const planLimits = await computePlanLimitsForCustomer(customer, defaultLimits);

    // Enforce limits for the requested entity based on plan limits
    const isAgentLimitReached = agentCount >= planLimits.agents;
    const isSessionLimitReached = sessionCount >= planLimits.sessions;
    const isConversationLimitReached = conversationCount >= planLimits.conversations;

    const shouldThrowAgentError = entity === 'agents' && isAgentLimitReached;
    const shouldThrowSessionError = entity === 'sessions' && isSessionLimitReached;
    const shouldThrowConversationError = entity === 'conversations' && isConversationLimitReached;

    if (shouldThrowAgentError) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You have reached the maximum number of agents for your plan',
      });
    }
    if (shouldThrowSessionError) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You have reached the maximum number of sessions for your plan',
      });
    }
    if (shouldThrowConversationError) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You have reached the maximum number of conversations for your plan',
      });
    }

    return next({ ctx: { ...ctx, customer } });

/*
    // If user has any active subscription, allow
    const isPremium = customer.activeSubscriptions.length > 0;
    if (isPremium) {
      return next({ ctx: { ...ctx, customer } });
    }

    // Count current usage for free users
    const [agentRow] = await ctx.db
      .select({ count: count(agents.id) })
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id));

    const [sessionRow] = await ctx.db
      .select({ count: count(sessions.id) })
      .from(sessions)
      .where(eq(sessions.userId, ctx.auth.user.id));

    const [conversationRow] = await ctx.db
      .select({ count: count(conversations.id) })
      .from(conversations)
      .where(eq(conversations.userId, ctx.auth.user.id));

    const isFreeAgentLimitReached = agentRow.count >= MAX_FREE_AGENTS;
    const isFreeSessionLimitReached = sessionRow.count >= MAX_FREE_SESSIONS;
    const isFreeConversationLimitReached = conversationRow.count >= MAX_FREE_CONVERSATIONS;

    const shouldThrowAgentError = entity === 'agents' && isFreeAgentLimitReached;
    const shouldThrowSessionError = entity === 'sessions' && isFreeSessionLimitReached;
    const shouldThrowConversationError = entity === 'conversations' && isFreeConversationLimitReached;

    if (shouldThrowAgentError) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You have reached the maximum number of free agents',
      });
    }
    if (shouldThrowSessionError) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You have reached the maximum number of free sessions',
      });
    }
    if (shouldThrowConversationError) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You have reached the maximum number of free conversations',
      });
    }
*/

  });

// Simple in-memory rate limiter per user for write operations using TTL
const rateLimitCache = new LRUCache<string, number>({
  max: 10_000,
  ttlAutopurge: true,
});

export const rateLimited = (options: { windowMs: number; max: number }) =>
  createMiddleware(async ({ ctx, next, path }) => {
    const userId = ctx.session?.user?.id ?? 'anonymous';
    const key = `${userId}:${path}`;
    const nextCount = (rateLimitCache.get(key) ?? 0) + 1;
    rateLimitCache.set(key, nextCount, { ttl: options.windowMs });
    if (nextCount > options.max) {
      throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded' });
    }
    return next();
  });
