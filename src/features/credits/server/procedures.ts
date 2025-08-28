import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { creditTransactions, creditsWallets } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import { createTRPCRouter, protectedProcedure, rateLimited, baseProcedure } from "@/trpc/init";
import { 
  recordAiUsageAndCharge,
  recordCallUsageAndCharge,
  recordChatMessageUsageAndCharge,
  recordRealtimeApiUsageAndCharge,
  recordTranscriptionUsageAndCharge,
  recordInngestUsageAndCharge 
} from "./usage";
import { sendCreditBalanceUpdate, getCurrentBalance, CREDIT_DEDUCTION_REASONS } from "@/lib/credit-notifications";

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

  // Credit deduction mutations for different usage types
  // These mutations will be called from webhook handlers
  deductAiUsageCredits: baseProcedure
    .input(z.object({
      userId: z.string(),
      totalTokens: z.number().optional(),
      promptTokens: z.number().optional(),
      completionTokens: z.number().optional(),
      model: z.string().optional(),
      inputCreditsPerKTokens: z.number().optional(),
      outputCreditsPerKTokens: z.number().optional(),
      minimumCredits: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await recordAiUsageAndCharge(input);
      
      // Send real-time notification to client
      try {
        const newBalance = await getCurrentBalance(input.userId);
        await sendCreditBalanceUpdate(input.userId, {
          creditsDeducted: result.creditsDeducted,
          newBalance,
          reason: CREDIT_DEDUCTION_REASONS.AI_USAGE,
          metadata: {
            model: input.model,
            totalTokens: input.totalTokens,
            promptTokens: input.promptTokens,
            completionTokens: input.completionTokens,
          },
        });
      } catch (notificationError) {
        console.error('Failed to send credit balance notification:', notificationError);
        // Don't fail the mutation if notification fails
      }
      
      return { success: true, creditsDeducted: result.creditsDeducted };
    }),

  deductCallUsageCredits: baseProcedure
    .input(z.object({
      userId: z.string(),
      callDurationMs: z.number(),
      participantCount: z.number(),
      callId: z.string(),
      conversationId: z.string(),
      hasTranscription: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await recordCallUsageAndCharge(input);
      
      // Send real-time notification to client
      try {
        const newBalance = await getCurrentBalance(input.userId);
        await sendCreditBalanceUpdate(input.userId, {
          creditsDeducted: result.creditsDeducted,
          newBalance,
          reason: CREDIT_DEDUCTION_REASONS.CALL_USAGE,
          metadata: {
            callDurationMs: input.callDurationMs,
            participantCount: input.participantCount,
            callId: input.callId,
            conversationId: input.conversationId,
            hasTranscription: input.hasTranscription,
          },
        });
      } catch (notificationError) {
        console.error('Failed to send credit balance notification:', notificationError);
        // Don't fail the mutation if notification fails
      }
      
      return { success: true, creditsDeducted: result.creditsDeducted };
    }),

  deductChatMessageCredits: baseProcedure
    .input(z.object({
      userId: z.string(),
      messageCount: z.number(),
      channelId: z.string(),
      messageText: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await recordChatMessageUsageAndCharge(input);
      
      // Send real-time notification to client
      try {
        const newBalance = await getCurrentBalance(input.userId);
        await sendCreditBalanceUpdate(input.userId, {
          creditsDeducted: result.creditsDeducted,
          newBalance,
          reason: CREDIT_DEDUCTION_REASONS.CHAT_MESSAGE,
          metadata: {
            messageCount: input.messageCount,
            channelId: input.channelId,
            messageLength: input.messageText?.length,
          },
        });
      } catch (notificationError) {
        console.error('Failed to send credit balance notification:', notificationError);
        // Don't fail the mutation if notification fails
      }
      
      return { success: true, creditsDeducted: result.creditsDeducted };
    }),

  deductRealtimeApiCredits: baseProcedure
    .input(z.object({
      userId: z.string(),
      totalTokens: z.number().optional(),
      inputTokens: z.number().optional(),
      outputTokens: z.number().optional(),
      model: z.string().optional(),
      sessionDurationMs: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await recordRealtimeApiUsageAndCharge(input);
      
      // Send real-time notification to client
      try {
        const newBalance = await getCurrentBalance(input.userId);
        await sendCreditBalanceUpdate(input.userId, {
          creditsDeducted: result.creditsDeducted,
          newBalance,
          reason: CREDIT_DEDUCTION_REASONS.REALTIME_API,
          metadata: {
            model: input.model,
            totalTokens: input.totalTokens,
            inputTokens: input.inputTokens,
            outputTokens: input.outputTokens,
            sessionDurationMs: input.sessionDurationMs,
          },
        });
      } catch (notificationError) {
        console.error('Failed to send credit balance notification:', notificationError);
        // Don't fail the mutation if notification fails
      }
      
      return { success: true, creditsDeducted: result.creditsDeducted };
    }),

  deductTranscriptionCredits: baseProcedure
    .input(z.object({
      userId: z.string(),
      callDurationMs: z.number(),
      callId: z.string(),
      conversationId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const result = await recordTranscriptionUsageAndCharge(input);
      
      // Send real-time notification to client
      try {
        const newBalance = await getCurrentBalance(input.userId);
        await sendCreditBalanceUpdate(input.userId, {
          creditsDeducted: result.creditsDeducted,
          newBalance,
          reason: CREDIT_DEDUCTION_REASONS.TRANSCRIPTION,
          metadata: {
            callDurationMs: input.callDurationMs,
            callId: input.callId,
            conversationId: input.conversationId,
          },
        });
      } catch (notificationError) {
        console.error('Failed to send credit balance notification:', notificationError);
        // Don't fail the mutation if notification fails
      }
      
      return { success: true, creditsDeducted: result.creditsDeducted };
    }),

  deductInngestCredits: baseProcedure
    .input(z.object({
      userId: z.string(),
      functionName: z.string(),
      executionTimeMs: z.number(),
      metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await recordInngestUsageAndCharge(input);
      
      // Send real-time notification to client
      try {
        const newBalance = await getCurrentBalance(input.userId);
        await sendCreditBalanceUpdate(input.userId, {
          creditsDeducted: result.creditsDeducted,
          newBalance,
          reason: CREDIT_DEDUCTION_REASONS.INNGEST,
          metadata: {
            functionName: input.functionName,
            executionTimeMs: input.executionTimeMs,
            ...input.metadata,
          },
        });
      } catch (notificationError) {
        console.error('Failed to send credit balance notification:', notificationError);
        // Don't fail the mutation if notification fails
      }
      
      return { success: true, creditsDeducted: result.creditsDeducted };
    }),
});
