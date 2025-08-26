import { TRPCError } from "@trpc/server";
import { eq, and, getTableColumns, sql, ilike, desc } from "drizzle-orm";
import z from "zod";

import { agents, conversations, sessions } from "@/db/schema";
import { streamChat } from "@/lib/stream-chat";
import { streamVideo } from "@/lib/stream-video";
import { buildIlikePattern } from "@/lib/utils";
import { createTRPCRouter, premiumProcedure, protectedProcedure, rateLimited } from "@/trpc/init";
import { CreditService } from "@/lib/credits/simple-credit-service";

import { conversationsInsertSchema } from "../schema";
import { ConversationStatus } from "../types";

export const conversationRouter = createTRPCRouter({
  generateChatToken: protectedProcedure
    .use(rateLimited({ windowMs: 10_000, max: 50 }))
    .mutation(async ({ ctx }) => {
    const token = streamChat.createToken(ctx.auth.user.id);
    await streamChat.upsertUser({
      id: ctx.auth.user.id,
      role: "admin",
    });

    return token;
  }),
  generateCallToken: protectedProcedure
    .use(rateLimited({ windowMs: 10_000, max: 20 }))
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Verify conversation belongs to user
      const [conversationRow] = await ctx.db
        .select({
          ...getTableColumns(conversations),
        })
        .from(conversations)
        .where(
          and(
            eq(conversations.id, input.conversationId),
            eq(conversations.userId, ctx.auth.user.id),
          )
        );

      if (!conversationRow) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Conversation not found" });
      }

      // Enforce availability window on server
      const now = new Date();
      const availableAt = conversationRow.availableAt ? new Date(conversationRow.availableAt) : null;
      // Compute availability without comparing against unreachable statuses
      const status = conversationRow.status as ConversationStatus;
      const isWithinWindow = availableAt ? now.getTime() >= availableAt.getTime() : false;
      const isJoinAvailable =
        status === ConversationStatus.Active ||
        status === ConversationStatus.Available ||
        (status === ConversationStatus.Scheduled && isWithinWindow);

      if (!isJoinAvailable) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This call is not yet available. It will open 30 minutes before the scheduled time.",
        });
      }

      // Simple preflight credit check BEFORE issuing any token
      try {
        const { CreditService } = await import("@/lib/credits/simple-credit-service");
        const creditCheck = await CreditService.canStartCall(ctx.auth.user.id, 30); // 30 min estimate
        
        if (!creditCheck.canStart) {
          throw new TRPCError({
            code: "PAYMENT_REQUIRED", 
            message: creditCheck.error || "Insufficient credits to start the call",
          });
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Credit check failed" });
      }

      // Prepare user in Stream and issue token
      await streamVideo.upsertUsers([
        {
          id: ctx.auth.user.id,
          name: ctx.auth.user.name,
          role: "admin",
        },
      ]);

      const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
      const issuedAt = Math.floor(Date.now() / 1000) - 60;

      const token = streamVideo.generateUserToken({
        user_id: ctx.auth.user.id,
        exp: expirationTime,
        validity_in_seconds: issuedAt,
      });

      return token;
    }),
  create: premiumProcedure("conversations")
    .use(rateLimited({ windowMs: 10_000, max: 10 }))
    .input(conversationsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      // First verify the session exists and belongs to the user
      const [existingSession] = await ctx.db
        .select({
          ...getTableColumns(sessions),
          agent: agents,
        })
        .from(sessions)
        .innerJoin(agents, eq(sessions.agentId, agents.id))
        .where(
          and(
            eq(sessions.id, input.sessionId),
            eq(sessions.userId, ctx.auth.user.id)
          )
        );

      if (!existingSession) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found or you don't have permission",
        });
      }

      // Validate scheduling rules: if scheduledDateTime is provided, it must be in the future
      if (input.scheduledDateTime) {
        const now = new Date();
        const scheduled = new Date(input.scheduledDateTime);
        if (scheduled.getTime() <= now.getTime()) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Scheduled time must be in the future" });
        }
      }

      const [createdConversation] = await ctx.db
        .insert(conversations)
        .values({
          ...input,
          userId: ctx.auth.user.id,
          // Default state: scheduled with availableAt calculated
          status: input.scheduledDateTime ? ConversationStatus.Scheduled : ConversationStatus.Available,
          availableAt: input.scheduledDateTime
            ? new Date(new Date(input.scheduledDateTime).getTime() - 30 * 60 * 1000)
            : new Date(),
        })
        .returning();

      const call = streamVideo.video.call("default", createdConversation.id);
      
      await call.create({
        data: {
          created_by_id: ctx.auth.user.id,
          custom: {
            conversationId: createdConversation.id,
            conversationName: createdConversation.name
          },
          settings_override: {
            transcription: {
              language: "en",
              mode: "auto-on",
              closed_caption_mode: "auto-on",
            },
            recording: {
              mode: "disabled",
            },
          },
        },
      });

      await streamVideo.upsertUsers([
        {
          id: existingSession.agent.id,
          name: existingSession.agent.name,
          role: "user"
        },
      ]);

      return createdConversation;
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingConversation] = await ctx.db
        .select({
          ...getTableColumns(conversations),
          session: sessions,
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
        })
        .from(conversations)
        .innerJoin(sessions, eq(conversations.sessionId, sessions.id))
        .innerJoin(agents, eq(sessions.agentId, agents.id))
        .where(
          and(
            eq(conversations.id, input.id),
            eq(conversations.userId, ctx.auth.user.id),
          )
        );

      if (!existingConversation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
      }

      return existingConversation;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish(),
        sessionId: z.string().nullish(),
        status: z
          .enum([
            ConversationStatus.Scheduled,
            ConversationStatus.Available,
            ConversationStatus.Active,
            ConversationStatus.Completed,
            ConversationStatus.Processing,
            ConversationStatus.Cancelled,
          ])
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { status, sessionId } = input;
      const search = buildIlikePattern(input.search ?? undefined);

      const data = await ctx.db
        .select({
          ...getTableColumns(conversations),
          session: sessions,
          agent: agents,
        })
        .from(conversations)
        .innerJoin(sessions, eq(conversations.sessionId, sessions.id))
        .innerJoin(agents, eq(sessions.agentId, agents.id))
        .where(
          and(
            eq(conversations.userId, ctx.auth.user.id),
            search ? ilike(conversations.name, search) : undefined,
            status ? eq(conversations.status, status) : undefined,
            sessionId ? eq(conversations.sessionId, sessionId) : undefined,
          )
        )
        .orderBy(desc(conversations.createdAt), desc(conversations.id))

      return {
        items: data,
      };
    }),
  delete: protectedProcedure
    .use(rateLimited({ windowMs: 10_000, max: 20 }))
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [existingConversation] = await ctx.db
        .select()
        .from(conversations)
        .where(
          and(
            eq(conversations.id, input.id),
            eq(conversations.userId, ctx.auth.user.id)
          )
        );

      if (!existingConversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found or you don't have permission to delete it",
        });
      }

      // Allow deletion of any conversation except completed
      if (existingConversation.status === ConversationStatus.Completed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Completed conversations cannot be deleted",
        });
      }

      await ctx.db
        .delete(conversations)
        .where(eq(conversations.id, input.id));

      return { success: true };
    }),
}); 