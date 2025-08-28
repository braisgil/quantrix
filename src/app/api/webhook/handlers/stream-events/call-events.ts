/**
 * Stream call event handlers
 */
import { and, eq, not } from "drizzle-orm";
import {
  CallEndedEvent,
  CallTranscriptionReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
} from "@stream-io/node-sdk";
import { db } from "@/db";
import { agents, conversations, sessions } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { inngest } from "@/inngest/client";
import { 
  recordCallUsageAndCharge, 
  recordTranscriptionUsageAndCharge, 
  recordRealtimeApiUsageAndCharge 
} from "@/features/credits/server/usage";
import { WebhookResponses } from "../webhook-utils";
import { NextResponse } from "next/server";

/**
 * Handle call.session_started event
 */
export async function handleCallSessionStarted(event: CallSessionStartedEvent): Promise<NextResponse> {
  const conversationId = event.call.custom?.conversationId;

  if (!conversationId) {
    return WebhookResponses.error("Missing conversationId");
  }

  // Check if conversation exists and get current status
  const [existingConversation] = await db
    .select({
      id: conversations.id,
      status: conversations.status,
      sessionId: conversations.sessionId,
    })
    .from(conversations)
    .where(eq(conversations.id, conversationId));

  if (!existingConversation) {
    return WebhookResponses.error("Conversation not found", 404);
  }

  // Prevent duplicate processing
  if (existingConversation.status === "active" || 
      existingConversation.status === "completed" || 
      existingConversation.status === "cancelled" || 
      existingConversation.status === "processing") {
    console.warn(`Ignoring duplicate call.session_started for conversation ${conversationId}, status: ${existingConversation.status}`);
    return WebhookResponses.ignored();
  }

  try {
    // Get session and agent info
    const [existingSession] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, existingConversation.sessionId));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingSession.agentId));

    if (!existingSession || !existingAgent) {
      return WebhookResponses.error("Session or Agent not found", 404);
    }

    // Atomically set active only if still in valid state
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
      .returning({ id: conversations.id });

    if (updated.length === 0) {
      console.warn(`Conversation ${conversationId} status changed during processing, ignoring duplicate`);
      return WebhookResponses.ignored();
    }

    console.warn(`Connecting AI agent ${existingAgent.id} to call ${conversationId}`);

    // Connect OpenAI agent to the call
    const call = streamVideo.video.call("default", conversationId);
    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY!,
      agentUserId: existingAgent.id,
    });

    // Update session instructions with context
    const [convRow] = await db
      .select({ name: conversations.name })
      .from(conversations)
      .where(eq(conversations.id, conversationId));

    const conversationName = convRow?.name ?? 'unknown';
    
    realtimeClient.updateSession({
      instructions: `${existingAgent.instructions}\n\nContext:\n- Session Title: ${existingSession.name}\n- Conversation Title: ${conversationName}\n\nUse the conversation title to tailor your responses and maintain topical relevance.`,
    });

    // Set up usage tracking for OpenAI Realtime API
    realtimeClient.on("response.completed", (responseEvent: Record<string, unknown>) => {
      console.warn('Response completed', responseEvent);
      
      const response = responseEvent.response as Record<string, unknown>;
      const usage = response?.usage as Record<string, number> | undefined;
      
      if (usage && existingSession.userId) {
        recordRealtimeApiUsageAndCharge({
          userId: existingSession.userId,
          totalTokens: usage.total_tokens || 0,
          inputTokens: usage.input_tokens || 0,
          outputTokens: usage.output_tokens || 0,
          model: "gpt-4o-realtime",
        }).catch(error => {
          console.error('Failed to record realtime API usage:', error);
        });
      }
    });

    console.warn('Successfully connected OpenAI agent', { agentId: existingAgent.id, conversationId });
    return WebhookResponses.ok();

  } catch (error) {
    console.error(`Failed to connect OpenAI agent to call ${conversationId}:`, error);
    
    // Revert conversation status on connection failure
    await db
      .update(conversations)
      .set({ status: "available", startedAt: null })
      .where(eq(conversations.id, conversationId));
    
    return WebhookResponses.error("Failed to connect AI agent", 500);
  }
}

/**
 * Handle call.session_participant_left event
 */
export async function handleCallSessionParticipantLeft(event: CallSessionParticipantLeftEvent): Promise<NextResponse> {
  const conversationId = event.call_cid.split(":")[1];

  if (!conversationId) {
    return WebhookResponses.error("Missing conversationId");
  }

  try {
    const call = streamVideo.video.call("default", conversationId);
    await call.end();
    return WebhookResponses.ok();
  } catch (error) {
    console.error(`Failed to end call ${conversationId}:`, error);
    return WebhookResponses.error("Failed to end call", 500);
  }
}

/**
 * Handle call.session_ended event
 */
export async function handleCallSessionEnded(event: CallEndedEvent): Promise<NextResponse> {
  const conversationId = event.call.custom?.conversationId;

  if (!conversationId) {
    return WebhookResponses.error("Missing conversationId");
  }

  try {
    // Get conversation and session for billing
    const [existingConversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId));

    if (existingConversation) {
      const [existingSession] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, existingConversation.sessionId));

      // Track call usage for billing
      if (existingSession && existingConversation.startedAt) {
        const callDurationMs = Date.now() - existingConversation.startedAt.getTime();
        const participantCount = 2; // Always AI agent + user

        recordCallUsageAndCharge({
          userId: existingSession.userId,
          callDurationMs,
          participantCount,
          callId: conversationId,
          conversationId: conversationId,
          hasTranscription: false, // TODO: Detect if transcription was enabled
        }).catch(error => {
          console.error('Failed to record call usage:', error);
        });
      }
    }

    // Update conversation status
    await db
      .update(conversations)
      .set({
        status: "processing",
        endedAt: new Date(),
      })
      .where(and(eq(conversations.id, conversationId), eq(conversations.status, "active")));

    return WebhookResponses.ok();

  } catch (error) {
    console.error(`Failed to handle call end for ${conversationId}:`, error);
    return WebhookResponses.error("Failed to process call end", 500);
  }
}

/**
 * Handle call.transcription_ready event
 */
export async function handleCallTranscriptionReady(event: CallTranscriptionReadyEvent): Promise<NextResponse> {
  const conversationId = event.call_cid.split(":")[1];

  if (!conversationId) {
    return WebhookResponses.error("Missing conversationId");
  }

  try {
    // Verify conversation exists
    const [existingConversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId));

    if (!existingConversation) {
      return WebhookResponses.error("Conversation not found", 404);
    }

    // Bill for transcription service usage
    const [existingSession] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, existingConversation.sessionId));

    if (existingSession && existingConversation.startedAt) {
      const callDurationMs = (existingConversation.endedAt?.getTime() ?? Date.now()) 
        - existingConversation.startedAt.getTime();
      
      recordTranscriptionUsageAndCharge({
        userId: existingSession.userId,
        callDurationMs,
        callId: conversationId,
        conversationId: conversationId,
      }).catch(error => {
        console.error('Failed to record transcription usage:', error);
      });
    }

    // Trigger conversation processing
    await inngest.send({
      name: "conversations/processing",
      data: {
        conversationId: existingConversation.id,
        transcriptUrl: event.call_transcription.url,
      },
    });

    return WebhookResponses.ok();

  } catch (error) {
    console.error(`Failed to handle transcription ready for ${conversationId}:`, error);
    return WebhookResponses.error("Failed to process transcription", 500);
  }
}
