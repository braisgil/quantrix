import { auth } from '@/lib/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { LRUCache } from 'lru-cache';
import { headers } from 'next/headers';
import { cache } from 'react';
import { db } from '@/db';

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
