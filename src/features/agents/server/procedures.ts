import { agents, conversations, sessions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure, rateLimited } from "@/trpc/init";
import { agentsInsertSchema } from "../schema";
import { and, getTableColumns, desc, eq, ilike, sql } from "drizzle-orm";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { buildIlikePattern } from "@/lib/utils";

export const agentsRouter = createTRPCRouter({
  create: protectedProcedure
  .use(rateLimited({ windowMs: 10_000, max: 10 }))
  .input(agentsInsertSchema)
  .mutation(async ({ input, ctx }) => {
    const [createdAgent] = await ctx.db
      .insert(agents)
      .values({
        ...input,
        userId: ctx.auth.user.id,
      })
      .returning();

    return createdAgent;
  }),
  getMany: protectedProcedure
  .input(
    z.object({
      search: z.string().nullish()
    })
  )
  .query(async ({ ctx, input }) => {
    const safeSearch = buildIlikePattern(input.search ?? undefined);
    const data = await ctx.db
      .select({
        ...getTableColumns(agents),
        conversationCount: sql<number>`
          COUNT(DISTINCT ${conversations.id})
        `.as("conversationCount"),
        totalDuration: sql<number>`
          COALESCE(
            NULLIF(
              SUM(
                CASE 
                  WHEN ${conversations.startedAt} IS NOT NULL 
                    AND ${conversations.endedAt} IS NOT NULL 
                    AND ${conversations.endedAt} > ${conversations.startedAt}
                  THEN EXTRACT(EPOCH FROM (${conversations.endedAt} - ${conversations.startedAt}))
                  ELSE 0 
                END
              ), 0
            ), 0
          )
        `.as("totalDuration"),
      })
      .from(agents)
      .leftJoin(sessions, eq(agents.id, sessions.agentId))
      .leftJoin(conversations, eq(sessions.id, conversations.sessionId))
      .where(
        and(
          eq(agents.userId, ctx.auth.user.id),
          safeSearch ? ilike(agents.name, safeSearch) : undefined,
        )
      )
      .groupBy(agents.id)
      .orderBy(desc(agents.createdAt), desc(agents.id))
    return {
      items: data,
    };
  }),
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const [existingAgent] = await ctx.db
      .select({
        ...getTableColumns(agents),
        conversationCount: sql<number>`
          COUNT(DISTINCT ${conversations.id})
        `.as("conversationCount"),
        totalDuration: sql<number>`
          COALESCE(
            NULLIF(
              SUM(
                CASE 
                  WHEN ${conversations.startedAt} IS NOT NULL 
                    AND ${conversations.endedAt} IS NOT NULL 
                    AND ${conversations.endedAt} > ${conversations.startedAt}
                  THEN EXTRACT(EPOCH FROM (${conversations.endedAt} - ${conversations.startedAt}))
                  ELSE 0 
                END
              ), 0
            ), 0
          )
        `.as("totalDuration"),
      })
      .from(agents)
      .leftJoin(sessions, eq(agents.id, sessions.agentId))
      .leftJoin(conversations, eq(sessions.id, conversations.sessionId))
      .where(
        and(
          eq(agents.id, input.id),
          eq(agents.userId, ctx.auth.user.id),
        )
      )
      .groupBy(agents.id);

    if (!existingAgent) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
    }

    return existingAgent;
  }),
  delete: protectedProcedure
    .use(rateLimited({ windowMs: 10_000, max: 20 }))
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [existingAgent] = await ctx.db
        .select()
        .from(agents)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, ctx.auth.user.id)
          )
        );

      if (!existingAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found or you don't have permission to delete it",
        });
      }

      await ctx.db
        .delete(agents)
        .where(eq(agents.id, input.id));

      return { success: true };
    }),
});