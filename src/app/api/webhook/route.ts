import OpenAI from "openai";
import { and, eq, not, sql } from "drizzle-orm";
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
import { agents, conversations, sessions, creditsWallets, creditTransactions } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";

import { inngest } from "@/inngest/client";

import { streamChat } from "@/lib/stream-chat";
import { recordAiUsageAndCharge } from "@/features/credits/server/usage";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
import { validateEvent } from "@polar-sh/sdk/webhooks";

function verifySignatureWithSDK(body: string, signature: string): boolean {
  // Keep Stream webhook verification for Stream events
  return streamVideo.verifyWebhook(body, signature);
};

export async function POST(req: NextRequest) {
  const body = await req.text();

  const headersObj = Object.fromEntries(req.headers);
  const hasPolarSignature = Boolean(headersObj['webhook-signature']);
  const streamSignature = req.headers.get("x-signature");

  // Debug entry log
  console.warn('Webhook received', {
    hasPolarSignature,
    hasStreamSignature: Boolean(streamSignature),
    type: (() => { try { return (JSON.parse(body) as any)?.type; } catch { return 'unknown'; } })(),
  });

  // Handle Polar webhook exclusively when Polar signature header is present
  if (hasPolarSignature) {
    try {
      const rawSecret = (process.env.POLAR_WEBHOOK_SECRET || '').trim();
      if (!rawSecret) {
        return NextResponse.json({ error: "Missing POLAR_WEBHOOK_SECRET" }, { status: 500 });
      }
      let polarEvent = validateEvent(body, headersObj, rawSecret);
      // If validation failed due to secret format (base64 vs raw), try fallback decode
      if (!polarEvent) {
        const fallbackSecret = (() => {
          try { return Buffer.from(rawSecret, 'base64').toString('utf-8'); } catch { return ''; }
        })();
        if (fallbackSecret) {
          polarEvent = validateEvent(body, headersObj, fallbackSecret);
        }
      }
      if (polarEvent.type === "order.paid") {
        const order = polarEvent.data;
        const externalId = order.customer.externalId;
        // Prefer order.metadata.credits, fallback to product.metadata.credits
        const creditsMeta = (order.metadata as Record<string, unknown> | undefined)?.credits
          ?? (order.product.metadata as Record<string, unknown> | undefined)?.credits
          ?? 0;
        const creditGrantRaw = typeof creditsMeta === 'number' ? creditsMeta : Number(creditsMeta);
        const creditGrant = Number.isFinite(creditGrantRaw) ? Math.max(0, Math.floor(creditGrantRaw)) : 0;

        if (externalId && creditGrant > 0) {
          // Upsert wallet and atomically increment balance
          await db
            .insert(creditsWallets)
            .values({ userId: externalId, balance: creditGrant })
            .onConflictDoUpdate({
              target: creditsWallets.userId,
              set: {
                balance: sql`${creditsWallets.balance} + ${creditGrant}`,
                updatedAt: new Date(),
              },
            });

          // Idempotency: skip if we've already recorded this order for this user
          const existing = await db
            .select({ id: creditTransactions.id })
            .from(creditTransactions)
            .where(
              and(
                eq(creditTransactions.userId, externalId),
                // metadata->>'orderId' = order.id
                eq(sql`(credit_transactions.metadata->>'orderId')`, order.id),
              ),
            );
          if (existing.length === 0) {
            await db.insert(creditTransactions).values({
              userId: externalId,
              amount: creditGrant,
              type: "purchase",
              description: `Credits purchased via Polar order ${order.id}`,
              metadata: { orderId: order.id, productId: order.productId },
            });
            console.warn('Polar credits granted', { externalId, creditGrant, orderId: order.id });
          }
        }

        return NextResponse.json({ status: "ok" });
      }
      // Unhandled Polar event type
      return NextResponse.json({ status: "ignored" });
    } catch {
      return NextResponse.json({ error: "Invalid Polar signature" }, { status: 401 });
    }
  }

  // Handle Stream webhook when x-signature header is present
  if (!streamSignature || !verifySignatureWithSDK(body, streamSignature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  console.warn('Stream webhook verified', { type: (() => { try { return (JSON.parse(body) as any)?.type; } catch { return 'unknown'; } })() });

  let payload: unknown;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;

  console.log(eventType)

  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const conversationId = event.call.custom?.conversationId;

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
    }

    // Atomically set active only if it wasn't already, to prevent double AI joins
    const updated = await db
      .update(conversations)
      .set({ status: "active", startedAt: new Date() })
      .where(
        and(
          eq(conversations.id, conversationId),
          not(eq(conversations.status, "completed")),
          not(eq(conversations.status, "active")),
          not(eq(conversations.status, "cancelled")),
          not(eq(conversations.status, "processing")),
        )
      )
      .returning({ id: conversations.id, sessionId: conversations.sessionId });

    if (updated.length === 0) {
      // Already active or invalid state; ignore duplicate
      console.warn('Stream call.session_started ignored (already active)', { conversationId });
      return NextResponse.json({ status: "ignored" });
    }

    const target = updated[0];

    // Get the session first, then the agent
    const [existingSession] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, target.sessionId));

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

    // Fetch conversation name to include in instructions
    const [convRow] = await db
      .select({ name: conversations.name })
      .from(conversations)
      .where(eq(conversations.id, conversationId));

    const conversationName = convRow?.name ?? 'unknown';

    realtimeClient.updateSession({
      instructions: `${existingAgent.instructions}\n\nContext:\n- Session Title: ${existingSession.name}\n- Conversation Title: ${conversationName}\n\nUse the conversation title to tailor your responses and maintain topical relevance.`,
    });

    console.warn('Connected OpenAI agent', { agentId: existingAgent.id, conversationId });
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
    // Verify conversation exists, but do not persist transcript URL in DB
    const [existingConversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId));

    if (!existingConversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    await inngest.send({
      name: "conversations/processing",
      data: {
        conversationId: existingConversation.id,
        transcriptUrl: event.call_transcription.url,
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

    console.warn('Stream message.new received', { channelId, userId });

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
    let conversationTitle: string | null = null;
    let sessionTitle: string | null = null;
    let ownerUserId: string | null = null;

    if (existingConversation) {
      targetSessionId = existingConversation.sessionId;
      conversationTitle = existingConversation.name;

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

      ownerUserId = existingSession.userId;
      agentId = existingAgent.id;
      agentName = existingAgent.name;
      agentInstructions = existingAgent.instructions;
      sessionTitle = existingSession.name;
      summariesText = `${existingConversation.summary ? `${existingConversation.name}:\n${existingConversation.summary}` : ""}`.trim();
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

      ownerUserId = existingSession.userId;
      targetSessionId = existingSession.id;
      sessionTitle = existingSession.name;
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
Session Title: ${sessionTitle ?? "unknown"}
${conversationTitle ? `\nCurrent Conversation Title: ${conversationTitle}\n` : ""}

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

      // Record AI usage and deduct credits (assumes externalId equals our userId)
      const usage = GPTResponse.usage;
      console.warn('Recording ai usage', {
        ownerUserId,
        total: usage?.total_tokens,
        prompt: usage?.prompt_tokens,
        completion: usage?.completion_tokens,
      });
      await recordAiUsageAndCharge({
        userId: ownerUserId ?? userId,
        totalTokens: usage?.total_tokens ?? 0,
        promptTokens: usage?.prompt_tokens ?? 0,
        completionTokens: usage?.completion_tokens ?? 0,
        model: "gpt-4o",
      });
    }
  }

  return NextResponse.json({ status: "ok" });
}