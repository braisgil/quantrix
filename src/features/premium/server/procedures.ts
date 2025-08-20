// Using shared helpers for counts and limits; direct schema imports no longer needed here
// import { agents, conversations, sessions } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { getDefaultLimits, getUsageCounts, computePlanLimitsForCustomer } from "./plan-limits";

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
    const { agentCount, sessionCount, conversationCount } = await getUsageCounts(ctx.db, ctx.auth.user.id);

    const defaultLimits = getDefaultLimits();
    const planLimits = await computePlanLimitsForCustomer(customer, defaultLimits);

    return {
      agents: { count: agentCount, limit: planLimits.agents },
      sessions: { count: sessionCount, limit: planLimits.sessions },
      conversations: { count: conversationCount, limit: planLimits.conversations },
    } as const;
  }),
});

