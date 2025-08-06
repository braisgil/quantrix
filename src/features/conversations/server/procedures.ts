import { agents, conversations, sessions, user } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq, and, getTableColumns, sql, ilike, desc, inArray } from "drizzle-orm";
import { conversationsInsertSchema } from "../schema";
import z from "zod";
import { ConversationStatus, StreamTranscriptItem } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { streamChat } from "@/lib/stream-chat";
import JSONL from "jsonl-parse-stringify";

export const conversationRouter = createTRPCRouter({
  generateChatToken: protectedProcedure.mutation(async ({ ctx }) => {
    const token = streamChat.createToken(ctx.auth.user.id);
    await streamChat.upsertUser({
      id: ctx.auth.user.id,
      role: "admin",
    });

    return token;
  }),
  generateToken: protectedProcedure.mutation(async ({ ctx }) => {
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
  create: protectedProcedure
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

      const [createdConversation] = await ctx.db
        .insert(conversations)
        .values({
          ...input,
          userId: ctx.auth.user.id,
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
              mode: "auto-on",
              quality: "1080p",
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
      const { search, status, sessionId } = input;

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
            search ? ilike(conversations.name, `%${search}%`) : undefined,
            status ? eq(conversations.status, status) : undefined,
            sessionId ? eq(conversations.sessionId, sessionId) : undefined,
          )
        )
        .orderBy(desc(conversations.createdAt), desc(conversations.id))

      return {
        items: data
      };
    }),
  getTranscript: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingConversation] = await ctx.db
        .select()
        .from(conversations)
        .where(
          and(eq(conversations.id, input.id), eq(conversations.userId, ctx.auth.user.id))
        );
  
      if (!existingConversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }
  
      if (!existingConversation.transcriptUrl) {
        return [];
      }
  
      const transcript = await fetch(existingConversation.transcriptUrl)
        .then((res) => res.text())
        .then((text) => JSONL.parse<StreamTranscriptItem>(text))
        .catch(() => {
          return [];
        });
  
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];
  
      const userSpeakers = await ctx.db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) =>
          users.map((user) => ({
            ...user,
          }))
        );
  
      const agentSpeakers = await ctx.db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) =>
          agents.map((agent) => ({
            ...agent,
          }))
        );
  
      const speakers = [...userSpeakers, ...agentSpeakers];
  
      const transcriptWithSpeakers = transcript.map((item) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id
        );
  
        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown",
            },
          };
        }
  
        return {
          ...item,
          user: {
            name: speaker.name,
          },
        };
      })
  
      return transcriptWithSpeakers;
    }),
}); 