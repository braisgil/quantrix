import { eq, count } from "drizzle-orm";

import { agents, conversations, sessions } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

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

  getUsage: protectedProcedure.query(async ({ ctx }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });

    const subscription = customer.activeSubscriptions[0];

    if (subscription) {
      return null;
    }

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

    return {
      agentCount: agentRow.count,
      sessionCount: sessionRow.count,
      conversationCount: conversationRow.count,
    };
  }),
});

