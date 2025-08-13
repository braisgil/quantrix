import { sessions, agents, conversations } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq, and, getTableColumns, ilike, desc, count } from "drizzle-orm";
import { sessionsInsertSchema, sessionsUpdateSchema } from "../schema";
import z from "zod";
import { SessionStatus } from "../types";

export const sessionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(sessionsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify that the agent exists and belongs to the user
      const [existingAgent] = await ctx.db
        .select()
        .from(agents)
        .where(
          and(
            eq(agents.id, input.agentId),
            eq(agents.userId, ctx.auth.user.id)
          )
        );

      if (!existingAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found or you don't have permission to use it",
        });
      }

      const [createdSession] = await ctx.db
        .insert(sessions)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      return createdSession;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: sessionsUpdateSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [existingSession] = await ctx.db
        .select()
        .from(sessions)
        .where(
          and(
            eq(sessions.id, input.id),
            eq(sessions.userId, ctx.auth.user.id)
          )
        );

      if (!existingSession) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      const [updatedSession] = await ctx.db
        .update(sessions)
        .set({
          ...input.data,
          updatedAt: new Date(),
        })
        .where(eq(sessions.id, input.id))
        .returning();

      return updatedSession;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [existingSession] = await ctx.db
        .select()
        .from(sessions)
        .where(
          and(
            eq(sessions.id, input.id),
            eq(sessions.userId, ctx.auth.user.id)
          )
        );

      if (!existingSession) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      await ctx.db
        .delete(sessions)
        .where(eq(sessions.id, input.id));

      return { success: true };
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingSession] = await ctx.db
        .select({
          ...getTableColumns(sessions),
          agent: agents,
          conversationCount: count(conversations.id),
        })
        .from(sessions)
        .innerJoin(agents, eq(sessions.agentId, agents.id))
        .leftJoin(conversations, eq(conversations.sessionId, sessions.id))
        .where(
          and(
            eq(sessions.id, input.id),
            eq(sessions.userId, ctx.auth.user.id)
          )
        )
        .groupBy(sessions.id, agents.id);

      if (!existingSession) {
        throw new TRPCError({ 
          code: "NOT_FOUND", 
          message: "Session not found" 
        });
      }

      return existingSession;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z
          .enum([
            SessionStatus.Active,
            SessionStatus.Archived,
            SessionStatus.Completed,
          ])
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, status, agentId } = input;

      const data = await ctx.db
        .select({
          ...getTableColumns(sessions),
          agent: agents,
          conversationCount: count(conversations.id),
        })
        .from(sessions)
        .innerJoin(agents, eq(sessions.agentId, agents.id))
        .leftJoin(conversations, eq(conversations.sessionId, sessions.id))
        .where(
          and(
            eq(sessions.userId, ctx.auth.user.id),
            search ? ilike(sessions.name, `%${search}%`) : undefined,
            status ? eq(sessions.status, status) : undefined,
            agentId ? eq(sessions.agentId, agentId) : undefined
          )
        )
        .groupBy(sessions.id, agents.id)
        .orderBy(desc(sessions.createdAt), desc(sessions.id));

      return {
        items: data
      };
    }),

  getSessionConversations: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        search: z.string().nullish(),
        status: z
          .enum([
            "scheduled",
            "available",
            "active",
            "completed",
            "processing",
            "cancelled",
          ])
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { sessionId, search, status } = input;

      // First verify the session belongs to the user
      const [existingSession] = await ctx.db
        .select()
        .from(sessions)
        .where(
          and(
            eq(sessions.id, sessionId),
            eq(sessions.userId, ctx.auth.user.id)
          )
        );

      if (!existingSession) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

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
            eq(conversations.sessionId, sessionId),
            eq(conversations.userId, ctx.auth.user.id),
            search ? ilike(conversations.name, `%${search}%`) : undefined,
            status ? eq(conversations.status, status) : undefined
          )
        )
        .orderBy(desc(conversations.createdAt), desc(conversations.id));

      return {
        items: data,
      };
    }),
});