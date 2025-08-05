import { agents, conversations } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq, and, getTableColumns, sql, ilike, desc } from "drizzle-orm";
import { conversationsInsertSchema } from "../schema";
import z from "zod";
import { ConversationStatus } from "../types";

export const conversationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(conversationsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdConversation] = await ctx.db
        .insert(conversations)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();
/*
      const call = streamVideo.video.call("default", createdMeeting.id);
      
      await call.create({
        data: {
          created_by_id: ctx.auth.user.id,
          custom: {
            meetingId: createdMeeting.id,
            meetingName: createdMeeting.name
          },
          settings_override: {
            transcription: {
              language: "en",
              mode: "auto-on",
              closed_caption_mode: "auto-on",
            },
            recording: {
              mode: "auto-on",
              quality: "1080p",
            },
          },
        },
      });
*/
      const [existingAgent] = await ctx.db
        .select()
        .from(agents)
        .where(eq(agents.id, createdConversation.agentId));

      if (!existingAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }
/*
      await streamVideo.upsertUsers([
        {
          id: existingAgent.id,
          name: existingAgent.name,
          role: "user",
          image: generateAvatarUri({
            seed: existingAgent.name,
            variant: "botttsNeutral",
          }),
        },
      ]);
*/
      return createdConversation;
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
    const [existingConversation] = await ctx.db
      .select({
        ...getTableColumns(conversations),
        agent: agents,
        duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
      })
      .from(conversations)
      .innerJoin(agents, eq(conversations.agentId, agents.id))
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
        agentId: z.string().nullish(),
        status: z
          .enum([
            ConversationStatus.Upcoming,
            ConversationStatus.Active,
            ConversationStatus.Completed,
            ConversationStatus.Processing,
            ConversationStatus.Cancelled,
          ])
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, status, agentId } = input;

      const data = await ctx.db
        .select({
          ...getTableColumns(conversations),
          agent: agents,
        })
        .from(conversations)
        .innerJoin(agents, eq(conversations.agentId, agents.id))
        .where(
          and(
            eq(conversations.userId, ctx.auth.user.id),
            search ? ilike(conversations.name, `%${search}%`) : undefined,
            status ? eq(conversations.status, status) : undefined,
            agentId ? eq(conversations.agentId, agentId) : undefined,
          )
        )
        .orderBy(desc(conversations.createdAt), desc(conversations.id))

      return {
        items: data
      };
    }),
}); 