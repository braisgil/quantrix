import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { CreditMeteringService } from "@/lib/credits/metering";
import { db } from "@/db";
import { creditPackages, creditTransactions, usageEvents, servicePricing } from "@/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { polarClient } from "@/lib/polar";
import Decimal from "decimal.js";



// Define types for Polar checkout
interface CheckoutCreate {
  products: string[];
  successUrl?: string | null;
  metadata?: Record<string, string | number | boolean>;
}

interface PolarCheckoutResponse {
  id: string;
  url?: string;
  status?: string;
  transactionId?: string;
  metadata?: Record<string, unknown>;
}

export const creditsRouter = createTRPCRouter({
  /**
   * Get current credit balance for the authenticated user
   */
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const balance = await CreditMeteringService.getUserBalance(ctx.auth.user.id);

    return {
      availableCredits: balance.availableCredits.toNumber(),
      totalPurchased: balance.totalPurchased.toNumber(),
      totalUsed: balance.totalUsed.toNumber(),
      displayAvailable: balance.availableCredits.toFixed(2),
    };
  }),

  /**
   * Get credit packages available for purchase
   */
  getCreditPackages: protectedProcedure.query(async () => {
    const packages = await db
      .select()
      .from(creditPackages)
      .where(eq(creditPackages.isActive, true))
      .orderBy(creditPackages.price);

    return packages.map((pkg) => ({
      id: pkg.id,
      polarProductId: pkg.polarProductId,
      credits: new Decimal(pkg.credits).toNumber(),
      bonusCredits: new Decimal(pkg.bonusCredits).toNumber(),
      totalCredits: new Decimal(pkg.credits).plus(pkg.bonusCredits).toNumber(),
      price: new Decimal(pkg.price).toNumber(),
      name: pkg.name,
      description: pkg.description,
      pricePerCredit: new Decimal(pkg.price)
        .div(new Decimal(pkg.credits).plus(pkg.bonusCredits))
        .toFixed(4),
    }));
  }),

  /**
   * Get transaction history
   */
  getTransactionHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        type: z
          .enum(["purchase", "usage", "refund", "adjustment", "expiration"])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const transactions = await CreditMeteringService.getUserTransactionHistory(
        ctx.auth.user.id,
        {
          limit: input.limit,
          offset: input.offset,
          type: input.type,
        }
      );

      return transactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        amount: new Decimal(tx.amount).toNumber(),
        balanceBefore: new Decimal(tx.balanceBefore).toNumber(),
        balanceAfter: new Decimal(tx.balanceAfter).toNumber(),
        description: tx.description,
        metadata: tx.metadata ? JSON.parse(tx.metadata) : null,
        createdAt: tx.createdAt.toISOString(),
      }));
    }),

  /**
   * Get usage history
   */
  getUsageHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        service: z
          .enum([
            "openai_gpt4o",
            "openai_gpt4o_mini",
            "stream_video_call",
            "stream_chat_message",
            "stream_transcription",
          ])
          .optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const usage = await CreditMeteringService.getUserUsageHistory(
        ctx.auth.user.id,
        {
          limit: input.limit,
          offset: input.offset,
          service: input.service,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
        }
      );

      return usage.map((event) => ({
        id: event.id,
        service: event.service,
        quantity: new Decimal(event.quantity).toNumber(),
        unitCost: new Decimal(event.unitCost).toNumber(),
        totalCost: new Decimal(event.totalCost).toNumber(),
        resourceId: event.resourceId,
        resourceType: event.resourceType,
        metadata: event.metadata ? JSON.parse(event.metadata) : null,
        createdAt: event.createdAt.toISOString(),
      }));
    }),

  /**
   * Get usage statistics
   */
  getUsageStats: protectedProcedure
    .input(
      z.object({
        period: z.enum(["day", "week", "month", "all"]).default("month"),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      let startDate: Date;

      switch (input.period) {
        case "day":
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "all":
          startDate = new Date(0);
          break;
      }

      const usage = await db
        .select({
          service: usageEvents.service,
          totalCost: sql<string>`COALESCE(SUM(CAST(${usageEvents.totalCost} AS NUMERIC)), 0)::TEXT`,
          totalQuantity: sql<string>`COALESCE(SUM(CAST(${usageEvents.quantity} AS NUMERIC)), 0)::TEXT`,
          count: sql<number>`COUNT(*)::INTEGER`,
        })
        .from(usageEvents)
        .where(
          and(
            eq(usageEvents.userId, ctx.auth.user.id),
            gte(usageEvents.createdAt, startDate)
          )
        )
        .groupBy(usageEvents.service);

      const totalCost = usage.reduce(
        (sum, item) => {
          const cost = item.totalCost || '0';
          return sum.plus(new Decimal(cost));
        },
        new Decimal(0)
      );

      return {
        period: input.period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        totalCost: totalCost.toNumber(),
        byService: usage.map((item) => ({
          service: item.service,
          totalCost: new Decimal(item.totalCost || '0').toNumber(),
          totalQuantity: new Decimal(item.totalQuantity || '0').toNumber(),
          count: item.count || 0,
        })),
      };
    }),

  /**
   * Initialize checkout for credit purchase
   */
  initiateCreditPurchase: protectedProcedure
    .input(
      z.object({
        packageId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get the credit package
      const [creditPackage] = await db
        .select()
        .from(creditPackages)
        .where(
          and(
            eq(creditPackages.id, input.packageId),
            eq(creditPackages.isActive, true)
          )
        )
        .limit(1);

      if (!creditPackage) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Credit package not found",
        });
      }

      // Create checkout session with Polar
      const checkoutData: CheckoutCreate = {
        products: [creditPackage.polarProductId], // products is an array of product IDs
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL}/credits/success?session_id={CHECKOUT_ID}`,
        metadata: {
          userId: ctx.auth.user.id,
          packageId: creditPackage.id,
          credits: creditPackage.credits,
          bonusCredits: creditPackage.bonusCredits,
        },
      };
      
      const checkout = await polarClient.checkouts.create(checkoutData) as PolarCheckoutResponse;

      return {
        checkoutUrl: checkout.url || '',
        checkoutId: checkout.id,
      };
    }),

  /**
   * Confirm credit purchase after successful checkout
   */
  confirmCreditPurchase: protectedProcedure
    .input(
      z.object({
        checkoutId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {

        
        // Verify the checkout with Polar
        const checkout = await polarClient.checkouts.get({
          id: input.checkoutId,
        }) as PolarCheckoutResponse;



        if (!checkout || checkout.status !== "succeeded") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid or incomplete checkout",
          });
        }

        // Check if we've already processed this checkout
        const existingTransaction = await db
          .select()
          .from(creditTransactions)
          .where(eq(creditTransactions.polarCheckoutId, input.checkoutId))
          .limit(1);

        if (existingTransaction.length > 0) {

          return { success: true, alreadyProcessed: true };
        }

        // Get the credit package details
        const metadata = checkout.metadata as {
          packageId: string;
          credits: string;
          bonusCredits: string;
        };



        const totalCredits = new Decimal(metadata.credits).plus(metadata.bonusCredits);

        // Add credits to user balance

        await CreditMeteringService.addCredits({
          userId: ctx.auth.user.id,
          credits: totalCredits.toNumber(),
          polarCheckoutId: input.checkoutId,
          polarTransactionId: checkout.transactionId || input.checkoutId,
          description: `Purchased ${metadata.credits} credits (+${metadata.bonusCredits} bonus)`,
        });


        return { success: true, creditsAdded: totalCredits.toNumber() };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to confirm credit purchase",
        });
      }
    }),

  /**
   * Get current service pricing
   */
  getServicePricing: protectedProcedure.query(async () => {
    const pricing = await db
      .select()
      .from(servicePricing)
      .where(eq(servicePricing.isActive, true));

    return pricing.map((price) => ({
      service: price.service,
      unitPrice: new Decimal(price.unitPrice).toNumber(),
      creditConversionRate: new Decimal(price.creditConversionRate).toNumber(),
      profitMargin: new Decimal(price.profitMargin).toNumber(),
      metadata: price.metadata ? JSON.parse(price.metadata) : null,
    }));
  }),

  /**
   * Estimate credit cost for an operation
   */
  estimateCost: protectedProcedure
    .input(
      z.object({
        operations: z.array(
          z.union([
            z.object({
              type: z.literal("openai"),
              model: z.enum(["gpt-4o", "gpt-4o-mini"]),
              estimatedInputTokens: z.number(),
              estimatedOutputTokens: z.number(),
            }),
            z.object({
              type: z.literal("stream"),
              service: z.enum(["video_call", "chat_message", "transcription"]),
              quantity: z.number(),
            }),
          ])
        ),
      })
    )
    .query(async ({ input }) => {
      let totalCredits = new Decimal(0);
      let totalUSD = new Decimal(0);
      const estimates = [];

      for (const op of input.operations) {
        if (op.type === "openai") {
          const cost = await CreditMeteringService.estimateOpenAICost(
            op.model,
            op.estimatedInputTokens,
            op.estimatedOutputTokens
          );
          totalCredits = totalCredits.plus(cost.credits);
          totalUSD = totalUSD.plus(cost.usd);
          estimates.push({
            type: "openai",
            model: op.model,
            credits: cost.credits,
            usd: cost.usd,
          });
        } else if (op.type === "stream") {
          const cost = await CreditMeteringService.estimateStreamCost(
            op.service,
            op.quantity
          );
          totalCredits = totalCredits.plus(cost.credits);
          totalUSD = totalUSD.plus(cost.usd);
          estimates.push({
            type: "stream",
            service: op.service,
            credits: cost.credits,
            usd: cost.usd,
          });
        }
      }

      return {
        totalCredits: totalCredits.toNumber(),
        totalUSD: totalUSD.toNumber(),
        breakdown: estimates,
      };
    }),

  /**
   * Check if user has sufficient credits
   */
  checkSufficientCredits: protectedProcedure
    .input(
      z.object({
        requiredCredits: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const balance = await CreditMeteringService.getUserBalance(ctx.auth.user.id);
      const hasSufficient = balance.availableCredits.greaterThanOrEqualTo(input.requiredCredits);

      return {
        hasSufficient,
        availableCredits: balance.availableCredits.toNumber(),
        requiredCredits: input.requiredCredits,
        shortfall: hasSufficient
          ? 0
          : new Decimal(input.requiredCredits).minus(balance.availableCredits).toNumber(),
      };
    }),
});
