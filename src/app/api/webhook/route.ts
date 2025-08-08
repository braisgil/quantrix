import OpenAI from "openai";
import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import {
  MessageNewEvent,
  CallEndedEvent,
  CallTranscriptionReadyEvent,
  CallRecordingReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
} from "@stream-io/node-sdk";

import { db } from "@/db";
import { agents, conversations, sessions } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";

import { inngest } from "@/inngest/client";

import { streamChat } from "@/lib/stream-chat";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
};

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: "Missing signature or API key" },
      { status: 400 }
    );
  }

  const body = await req.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;

  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const conversationId = event.call.custom?.conversationId;

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
    }

    const [existingConversation] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          not(eq(conversations.status, "completed")),
          not(eq(conversations.status, "active")),
          not(eq(conversations.status, "cancelled")),
          not(eq(conversations.status, "processing")),
        )
      );

    if (!existingConversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    await db
      .update(conversations)
      .set({
        status: "active",
        startedAt: new Date(),
      })
      .where(eq(conversations.id, existingConversation.id));

    // Get the session first, then the agent
    const [existingSession] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, existingConversation.sessionId));

    if (!existingSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingSession.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const call = streamVideo.video.call("default", conversationId);
    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY!,
      agentUserId: existingAgent.id,
    });

    realtimeClient.updateSession({
      instructions: existingAgent.instructions,
    });
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const conversationId = event.call_cid.split(":")[1]; // call_cid is formatted as "type:id"

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
    }

    const call = streamVideo.video.call("default", conversationId);
    await call.end();
  } else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const conversationId = event.call.custom?.conversationId;

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
    }

    await db
      .update(conversations)
      .set({
        status: "processing",
        endedAt: new Date(),
      })
      .where(and(eq(conversations.id, conversationId), eq(conversations.status, "active")));
  } else if (eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const conversationId = event.call_cid.split(":")[1]; // call_cid is formatted as "type:id"

    const [updatedConversation] = await db
      .update(conversations)
      .set({
        transcriptUrl: event.call_transcription.url,
      })
      .where(eq(conversations.id, conversationId))
      .returning();

    if (!updatedConversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    await inngest.send({
      name: "conversations/processing",
      data: {
        conversationId: updatedConversation.id,
        transcriptUrl: updatedConversation.transcriptUrl,
      },
    });
  } else if (eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const conversationId = event.call_cid.split(":")[1]; // call_cid is formatted as "type:id"

    await db
      .update(conversations)
      .set({
        recordingUrl: event.call_recording.url,
      })
      .where(eq(conversations.id, conversationId));
  } else if (eventType === "message.new") {
    const event = payload as MessageNewEvent;

    const userId = event.user?.id;
    const channelId = event.channel_id;
    const text = event.message?.text;

    if (!userId || !channelId || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prefer conversation-level context if the channel corresponds to a completed conversation.
    const [existingConversation] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, channelId), eq(conversations.status, "completed")));

    // Determine session/agent and context summaries
    let targetSessionId: string | null = null;
    let agentId: string | null = null;
    let agentName: string | null = null;
    let agentInstructions: string | null = null;
    let summariesText: string = "";

    if (existingConversation) {
      targetSessionId = existingConversation.sessionId;

      const [existingSession] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, targetSessionId));

      if (!existingSession) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }

      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, existingSession.agentId));

      if (!existingAgent) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 });
      }

      agentId = existingAgent.id;
      agentName = existingAgent.name;
      agentInstructions = existingAgent.instructions;
      summariesText = `${existingConversation.summary ?? ""}`.trim();
    } else {
      // Otherwise, treat the channel ID as a session-level chat, aggregating all completed conversations
      const [existingSession] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, channelId));

      if (!existingSession) {
        return NextResponse.json({ error: "Conversation or Session not found" }, { status: 404 });
      }

      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, existingSession.agentId));

      if (!existingAgent) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 });
      }

      targetSessionId = existingSession.id;
      agentId = existingAgent.id;
      agentName = existingAgent.name;
      agentInstructions = existingAgent.instructions;

      const completedConversations = await db
        .select()
        .from(conversations)
        .where(
          and(
            eq(conversations.sessionId, existingSession.id),
            eq(conversations.status, "completed"),
          )
        );

      summariesText = completedConversations
        .filter((c) => c.summary && c.summary.trim() !== "")
        .map((c) => `- ${c.name}:\n${c.summary}`)
        .join("\n\n");
    }

    if (!agentId || !agentName || !agentInstructions) {
      return NextResponse.json({ error: "Agent information incomplete" }, { status: 500 });
    }

    if (userId !== agentId) {
      const instructions = `
You are an AI assistant helping the user revisit completed conversations from a session.

Session ID: ${targetSessionId ?? "unknown"}

Summaries of completed conversations (use as primary factual context):
${summariesText || "(No completed conversation summaries are available yet.)"}

Follow the original assistant instructions below while responding:
${agentInstructions}

The user may ask questions about any of the completed conversations, request clarifications, or ask for follow-up actions. Always base your responses on the summaries above and the ongoing chat context.
If the summaries do not contain enough information to answer a question, say so and suggest a reasonable next step.
Be concise and helpful.
      `;

      const channel = streamChat.channel("messaging", channelId);
      await channel.watch();

      const previousMessages = channel.state.messages
        .slice(-5)
        .filter((msg) => msg.text && msg.text.trim() !== "")
        .map<ChatCompletionMessageParam>((message) => ({
          role: message.user?.id === agentId ? "assistant" : "user",
          content: message.text || "",
        }));

      const GPTResponse = await openaiClient.chat.completions.create({
        messages: [
          { role: "system", content: instructions },
          ...previousMessages,
          { role: "user", content: text },
        ],
        model: "gpt-4o",
      });

      const GPTResponseText = GPTResponse.choices[0].message.content;

      if (!GPTResponseText) {
        return NextResponse.json(
          { error: "No response from GPT" },
          { status: 400 }
        );
      }

      streamChat.upsertUser({
        id: agentId,
        name: agentName,
      });

      channel.sendMessage({
        text: GPTResponseText,
        user: {
          id: agentId,
          name: agentName,
        },
      });
    }
  }

  return NextResponse.json({ status: "ok" });
}