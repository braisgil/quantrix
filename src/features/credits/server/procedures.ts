import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { creditTransactions, creditsWallets } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import { createTRPCRouter, protectedProcedure, rateLimited } from "@/trpc/init";

export const creditsRouter = createTRPCRouter({
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;
    const [wallet] = await db
      .select()
      .from(creditsWallets)
      .where(eq(creditsWallets.userId, userId));

    return { balance: wallet?.balance ?? 0 } as const;
  }),

  getCreditProducts: protectedProcedure.query(async () => {
    const products = await polarClient.products.list({
      isArchived: false,
      isRecurring: false,
      sorting: ["price_amount"],
    });
    return products.result.items;
  }),

  getTransactions: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;
    const items = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(50);

    return items;
  }),

  createCheckout: protectedProcedure
    .use(rateLimited({ windowMs: 10_000, max: 5 }))
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { productId } = input;
      // Use Polar Better Auth client via authClient on the frontend for interactive checkout.
      // This endpoint is optional for server-driven flows.
      const checkout = await polarClient.checkouts.create({
        products: [productId],
        externalCustomerId: ctx.auth.user.id,
        successUrl:
          (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000") +
          "/credits",
      });
      return checkout;
    }),
});
