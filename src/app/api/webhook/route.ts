import OpenAI from "openai";
import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import {
  MessageNewEvent,
  CallEndedEvent,
  CallTranscriptionReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
} from "@stream-io/node-sdk";

import { db } from "@/db";
import { agents, conversations, sessions, usageEvents } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";

import { inngest } from "@/inngest/client";

import { streamChat } from "@/lib/stream-chat";
import { CreditMeteringService } from "@/lib/credits/metering";
import { SmartCreditManager } from "@/lib/credits/smart-credit-manager";
import { SmartCreditGuard } from "@/lib/credits/smart-credit-guard";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Conversation metadata interface
interface ConversationMetadata {
  creditReservations?: string[];
  creditWarnings?: string[];
  creditDegradation?: {
    processingSimplified?: boolean;
    usingEmergencyCredits?: boolean;
  };
  actualDurationMinutes?: number;
  actualCosts?: {
    videoCall?: number;
    transcription?: number;
    processing?: number;
  };
  creditTrackingSuccess?: boolean;
  creditsRefunded?: number;
  transcriptionCreditError?: string;
  transcriptionTimestamp?: string;
  cancellationReason?: string;
  error?: string;
}

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

    // Do NOT cancel the call after start. Preflight is enforced before token issuance.
    // We only record any warnings and rely on monitoring for graceful termination.
    const creditResult = await SmartCreditManager.startConversationWithCredits({
      userId: existingConversation.userId,
      conversationId,
      estimatedDurationMinutes: 5,
      enableProcessing: true,
      processingComplexity: "medium",
    });

    // Store credit reservation IDs in conversation metadata
    await db
      .update(conversations)
      .set({
        status: "active",
        startedAt: new Date(),
        metadata: JSON.stringify({
          creditReservations: creditResult.reservationIds,
          creditWarnings: creditResult.warnings,
          creditDegradation: creditResult.degradation,
        }),
      })
      .where(eq(conversations.id, existingConversation.id));

    const call = streamVideo.video.call("default", conversationId);
    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY!,
      agentUserId: existingAgent.id,
    });

    let instructions = `${existingAgent.instructions}\n\nContext:\n- Session Title: ${existingSession.name}\n- Conversation Title: ${existingConversation.name}\n\nUse the conversation title to tailor your responses and maintain topical relevance.`;

    // Add credit-related instructions if there are warnings
    if (creditResult.warnings && creditResult.warnings.length > 0) {
      instructions += `\n\nIMPORTANT CREDIT NOTICES:\n${creditResult.warnings.map(w => `- ${w}`).join('\n')}`;
      
      if (creditResult.degradation?.processingSimplified) {
        instructions += `\n- Post-conversation analysis will be simplified to preserve credits`;
      }
      
      if (creditResult.degradation?.usingEmergencyCredits) {
        instructions += `\n- Emergency credit buffer will be used to ensure full conversation completion`;
      }
      
      if (creditResult.degradation?.processingSimplified || creditResult.degradation?.usingEmergencyCredits) {
        instructions += `\n\nPlease inform the user about these credit optimizations if relevant to maintain transparency.`;
      }
    }

    realtimeClient.updateSession({
      instructions,
    });

    // Start aggressive credit monitoring to prevent overdraft
    // This will automatically terminate the call if credits run too low
    const callStartTime = new Date();
    
    // Get starting balance for projected monitoring
    const startBalance = await CreditMeteringService.getUserBalance(existingConversation.userId);
    const startingBalance = startBalance.availableCredits.plus(startBalance.availableFreeCredits).toNumber();
    
    const { stopMonitoring: _stopMonitoring } = await SmartCreditGuard.monitorOperation({
      userId: existingConversation.userId,
      operationType: "video_call",
      resourceId: conversationId,
      startingBalance,
      estimatedMinutesRemaining: () => {
        const elapsed = (new Date().getTime() - callStartTime.getTime()) / 1000 / 60;
        return Math.max(5, 30 - elapsed); // Assume max 30 min call, minimum 5 min remaining
      },
      onLowCredits: async (credits, warnings) => {
        // Send warning messages to the AI assistant to relay to user
        const warningInstructions = `${instructions}\n\nURGENT CREDIT WARNING: ${warnings.join(' | ')} - Please inform the user and suggest ending the call soon to avoid forced termination.`;
        realtimeClient.updateSession({ instructions: warningInstructions });
      },
             onForceTermination: async (reason) => {
         console.warn(`Force terminating call ${conversationId}: ${reason}`);
         
         // Update conversation status to completed with termination reason
         const currentMetadata = existingConversation.metadata ? JSON.parse(existingConversation.metadata) : {};
         await db
           .update(conversations)
           .set({
             status: "completed", // Mark as completed so UI shows proper ended state
             endedAt: new Date(),
             metadata: JSON.stringify({
               ...currentMetadata,
               forceTerminated: true,
               terminationReason: reason,
               terminationTime: new Date().toISOString(),
               overdraftPrevention: true, // Flag for UI to show overdraft message
             }),
           })
           .where(eq(conversations.id, conversationId));

         // End the call immediately and handle transcription of recorded portion
         try {
           await call.end();
           console.warn(`Call ${conversationId} terminated to prevent overdraft - conversation marked as completed`);
           
           // The call.session_ended webhook will handle transcription of the recorded portion
         } catch (error) {
           console.error(`Failed to end call ${conversationId}:`, error);
         }
       },
    });

    // Store monitoring cleanup function (ideally in a global map for cleanup)
    // For now, monitoring will auto-cleanup when call ends naturally
    
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const conversationId = event.call_cid.split(":")[1]; // call_cid is formatted as "type:id"

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
    }

    // Do not end the entire call when a single participant leaves.
    // The call should end naturally or via the credit monitor's force-termination.
    // This avoids expelling remaining participants and conflicting with client-side state.
    // Intentionally no-op here.
  } else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const conversationId = event.call.custom?.conversationId;

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
    }

    // Get conversation to calculate duration and retrieve credit info
    const [existingConversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId));

    if (existingConversation && existingConversation.startedAt) {
      const durationMs = new Date().getTime() - existingConversation.startedAt.getTime();
      const durationMinutes = durationMs / 1000 / 60;

      // Parse metadata to get credit info
      let metadata: ConversationMetadata = {};
      try {
        metadata = existingConversation.metadata ? JSON.parse(existingConversation.metadata) : {};
      } catch (e) {
        console.warn("Failed to parse conversation metadata:", e);
      }

      const creditReservations = metadata.creditReservations || [];
      const creditDegradation = metadata.creditDegradation || {};

      // Use enhanced credit tracking to handle the conversation end
      // Note: Transcription is ALWAYS processed as it's required for app functionality
      const endResult = await SmartCreditManager.endConversationWithCredits({
        userId: existingConversation.userId,
        conversationId,
        actualDurationMinutes: durationMinutes,
        reservationIds: creditReservations,
        processingComplexity: creditDegradation.processingSimplified ? "simple" : "medium",
        hadProcessing: true,
      });

      // Update conversation with actual costs and any issues
      const updatedMetadata = {
        ...metadata,
        actualDurationMinutes: durationMinutes,
        actualCosts: endResult.actualCosts,
        creditTrackingSuccess: endResult.success,
        creditsRefunded: endResult.creditsRefunded,
      };

      await db
        .update(conversations)
        .set({
          status: endResult.success ? "processing" : "completed", // Skip processing if credit tracking failed
          endedAt: new Date(),
          metadata: JSON.stringify(updatedMetadata),
        })
        .where(and(eq(conversations.id, conversationId), eq(conversations.status, "active")));

      // Log any credit tracking issues
      if (!endResult.success) {
        console.error(`Credit tracking failed for conversation ${conversationId}:`, endResult);
      }
    } else {
      // Fallback for conversations without proper start tracking
      await db
        .update(conversations)
        .set({
          status: "processing",
          endedAt: new Date(),
        })
        .where(and(eq(conversations.id, conversationId), eq(conversations.status, "active")));
    }
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

    // Parse metadata to check credit decisions
    let metadata: ConversationMetadata = {};
    try {
      metadata = existingConversation.metadata ? JSON.parse(existingConversation.metadata) : {};
    } catch (e) {
      console.warn("Failed to parse conversation metadata:", e);
    }

    const creditDegradation = metadata.creditDegradation || {};

    // Note: Transcription is ALWAYS processed as it's required for app functionality
    // No need to check for transcription disabling since it's never disabled

    // Idempotency: avoid double-counting if this conversation already has a transcription usage event
    const [existingTranscriptionUsage] = await db
      .select({ id: usageEvents.id })
      .from(usageEvents)
      .where(
        and(
          eq(usageEvents.resourceId, conversationId),
          eq(usageEvents.service, "stream_transcription")
        )
      )
      .limit(1);

    // Track transcription usage (ALWAYS required for app functionality)
    if (!existingTranscriptionUsage && existingConversation.startedAt && existingConversation.endedAt) {
      const durationMs = existingConversation.endedAt.getTime() - existingConversation.startedAt.getTime();
      const durationMinutes = durationMs / 1000 / 60;

      try {
        // Use enhanced tracking with emergency credit fallback
        // This should never fail as we ALWAYS allow emergency credits for transcription
        await SmartCreditManager.trackUsageWithSmartFallback({
          userId: existingConversation.userId,
          service: "stream_transcription",
          quantity: Math.ceil(durationMinutes),
          resourceId: conversationId,
          resourceType: "conversation",
          metadata: {
            durationMinutes,
            roundedMinutes: Math.ceil(durationMinutes),
          },
          allowEmergencyCredits: true, // ALWAYS allow emergency credits for transcription
        });
      } catch (error) {
        console.error(`CRITICAL: Failed to track transcription usage for conversation ${conversationId}:`, error);
        
        // Log the error but don't block processing - transcription is too important
        // Update conversation metadata to record the issue for debugging
        const updatedMetadata = {
          ...metadata,
          transcriptionCreditError: error instanceof Error ? error.message : "Unknown error",
          transcriptionTimestamp: new Date().toISOString(),
        };

        await db
          .update(conversations)
          .set({
            metadata: JSON.stringify(updatedMetadata),
          })
          .where(eq(conversations.id, conversationId));
      }
    }

    // Send to processing - transcription is always processed
    await inngest.send({
      name: "conversations/processing",
      data: {
        conversationId: existingConversation.id,
        transcriptUrl: event.call_transcription.url,
        processingComplexity: creditDegradation.processingSimplified ? "simple" : "medium",
      },
    });
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
    let conversationTitle: string | null = null;
    let sessionTitle: string | null = null;

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

      // Smart credit check with graceful handling
      const estimatedCost = await CreditMeteringService.estimateOpenAICost(
        "gpt-4o",
        2000, // Estimate based on typical chat context  
        500
      );

      const creditCheck = await SmartCreditGuard.handleInsufficientCredits({
        userId,
        requiredCredits: estimatedCost.credits,
        operationType: "chat_message",
        context: {
          resourceId: channelId,
          resourceType: "chat",
          emergencyCompletion: false, // Don't allow emergency credits for chat
        },
      });

      if (creditCheck.action === "block") {
        // Get current balance for more helpful message
        const creditStatus = await SmartCreditManager.getCreditStatus(userId);
        
        let message = creditCheck.message;
        if (creditStatus.recommendations.length > 0) {
          message += `\n\nRecommendations:\n${creditStatus.recommendations.map(r => `• ${r}`).join('\n')}`;
        }

        channel.sendMessage({
          text: message,
          user: {
            id: agentId,
            name: agentName,
          },
        });
        return NextResponse.json({ status: "insufficient_credits" });
      }

      const GPTResponse = await openaiClient.chat.completions.create({
        messages: [
          { role: "system", content: instructions },
          ...previousMessages,
          { role: "user", content: text },
        ],
        model: "gpt-4o",
      });

      // Track OpenAI usage with smart fallback
      if (GPTResponse.usage) {
        try {
          await SmartCreditManager.trackUsageWithSmartFallback({
            userId,
            service: "openai_gpt4o",
            quantity: GPTResponse.usage.total_tokens || 0,
            resourceId: existingConversation?.id || targetSessionId || channelId,
            resourceType: existingConversation ? "conversation" : "session",
            metadata: {
              model: "gpt-4o",
              promptTokens: GPTResponse.usage.prompt_tokens,
              completionTokens: GPTResponse.usage.completion_tokens,
              totalTokens: GPTResponse.usage.total_tokens,
              inputTokens: GPTResponse.usage.prompt_tokens,
              outputTokens: GPTResponse.usage.completion_tokens,
            },
            allowEmergencyCredits: false, // Don't allow emergency for chat
          });
        } catch (error) {
          console.error(`Failed to track OpenAI usage for chat: ${error}`);
          // Continue despite tracking error
        }
      }

      // Track Stream chat message usage with smart fallback
      try {
        await SmartCreditManager.trackUsageWithSmartFallback({
          userId,
          service: "stream_chat_message",
          quantity: 1,
          resourceId: channelId,
          resourceType: targetSessionId ? "session" : "chat",
          metadata: {
            channelId,
            sessionId: targetSessionId || undefined,
            messageCount: 1,
          },
          allowEmergencyCredits: false, // Don't allow emergency for chat
        });
      } catch (error) {
        console.error(`Failed to track chat message usage: ${error}`);
        // Continue despite tracking error
      }

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