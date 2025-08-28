/**
 * Stream message event handlers
 */
import { and, eq } from "drizzle-orm";
import { MessageNewEvent } from "@stream-io/node-sdk";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { db } from "@/db";
import { agents, conversations, sessions } from "@/db/schema";
import { streamChat } from "@/lib/stream-chat";
import { createWebhookCreditsClient } from "@/lib/trpc-server-client";
import { WebhookResponses, isMessageProcessed, markMessageAsProcessed } from "../webhook-utils";
import { NextResponse } from "next/server";

// Constants
const GPT_MODEL = "gpt-4o";
const CHAT_HISTORY_LIMIT = 5;

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

/**
 * Handle message.new event
 */
export async function handleMessageNew(event: MessageNewEvent): Promise<NextResponse> {
  const userId = event.user?.id;
  const channelId = event.channel_id;
  const text = event.message?.text;
  const messageId = event.message?.id;

  if (!userId || !channelId || !text || !messageId) {
    return WebhookResponses.error("Missing required fields");
  }

  // Skip empty or whitespace-only messages
  if (!text.trim()) {
    return WebhookResponses.ignored();
  }

  console.warn('Stream message.new received', { channelId, userId, messageId });

  try {
    // Deduplication check
    if (isMessageProcessed(messageId)) {
      console.warn(`Ignoring duplicate message ${messageId} in channel ${channelId} from ${userId}`);
      return WebhookResponses.duplicateIgnored();
    }

    markMessageAsProcessed(messageId);

    // Check if this is a system or automated message
    if (event.message?.type !== 'regular' && event.message?.type !== undefined) {
      console.warn(`Ignoring non-regular message type: ${event.message?.type}`);
      return WebhookResponses.ignored();
    }

    // Get context (conversation or session level)
    const context = await getMessageContext(channelId);
    
    if (!context) {
      return WebhookResponses.error("Conversation or Session not found", 404);
    }

    // Prevent AI agent feedback loops
    if (userId === context.agentId) {
      console.warn(`Ignoring message from AI agent ${context.agentId} to prevent feedback loop`);
      return WebhookResponses.ignored();
    }

    // Generate AI response
    const response = await generateAIResponse(context, text, channelId);
    
    if (!response) {
      return WebhookResponses.error("No response from GPT");
    }

    // Send response via Stream Chat
    await sendAIResponse(channelId, context.agentId, context.agentName, response);

    // Track usage and billing
    await trackMessageUsage(context, text, response);

    return WebhookResponses.ok();

  } catch (error) {
    console.error('Failed to handle message.new event:', error);
    return WebhookResponses.error("Failed to process message", 500);
  }
}

/**
 * Get message context (conversation or session level)
 */
async function getMessageContext(channelId: string) {
  // First try to get conversation-level context
  const [existingConversation] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.id, channelId), eq(conversations.status, "completed")));

  if (existingConversation) {
    const [existingSession] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, existingConversation.sessionId));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingSession.agentId));

    if (!existingSession || !existingAgent) {
      return null;
    }

    return {
      type: 'conversation' as const,
      targetSessionId: existingConversation.sessionId,
      conversationTitle: existingConversation.name,
      sessionTitle: existingSession.name,
      agentId: existingAgent.id,
      agentName: existingAgent.name,
      agentInstructions: existingAgent.instructions,
      ownerUserId: existingSession.userId,
      summariesText: existingConversation.summary 
        ? `${existingConversation.name}:\n${existingConversation.summary}` 
        : "",
    };
  }

  // Fall back to session-level context
  const [existingSession] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, channelId));

  if (!existingSession) {
    return null;
  }

  const [existingAgent] = await db
    .select()
    .from(agents)
    .where(eq(agents.id, existingSession.agentId));

  if (!existingAgent) {
    return null;
  }

  // Get completed conversations for session-level context
  const completedConversations = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.sessionId, existingSession.id),
        eq(conversations.status, "completed"),
      )
    );

  const summariesText = completedConversations
    .filter((c) => c.summary && c.summary.trim() !== "")
    .map((c) => `- ${c.name}:\n${c.summary}`)
    .join("\n\n");

  return {
    type: 'session' as const,
    targetSessionId: existingSession.id,
    sessionTitle: existingSession.name,
    agentId: existingAgent.id,
    agentName: existingAgent.name,
    agentInstructions: existingAgent.instructions,
    ownerUserId: existingSession.userId,
    summariesText,
    conversationTitle: null,
  };
}

/**
 * Generate AI response using OpenAI
 */
async function generateAIResponse(
  context: NonNullable<Awaited<ReturnType<typeof getMessageContext>>>,
  userMessage: string,
  channelId: string
): Promise<{ text: string; usage?: OpenAI.Completions.CompletionUsage } | null> {
  const instructions = `
You are an AI assistant helping the user revisit completed conversations from a session.

Session ID: ${context.targetSessionId ?? "unknown"}
Session Title: ${context.sessionTitle ?? "unknown"}
${context.conversationTitle ? `\nCurrent Conversation Title: ${context.conversationTitle}\n` : ""}

Summaries of completed conversations (use as primary factual context):
${context.summariesText || "(No completed conversation summaries are available yet.)"}

Follow the original assistant instructions below while responding:
${context.agentInstructions}

The user may ask questions about any of the completed conversations, request clarifications, or ask for follow-up actions. Always base your responses on the summaries above and the ongoing chat context.
If the summaries do not contain enough information to answer a question, say so and suggest a reasonable next step.
Be concise and helpful.
  `.trim();

  const channel = streamChat.channel("messaging", channelId);
  await channel.watch();

  const previousMessages = channel.state.messages
    .slice(-CHAT_HISTORY_LIMIT)
    .filter((msg) => msg.text && msg.text.trim() !== "")
    .map<ChatCompletionMessageParam>((message) => ({
      role: message.user?.id === context.agentId ? "assistant" : "user",
      content: message.text || "",
    }));

  const GPTResponse = await openaiClient.chat.completions.create({
    messages: [
      { role: "system", content: instructions },
      ...previousMessages,
      { role: "user", content: userMessage },
    ],
    model: GPT_MODEL,
  });

  const responseText = GPTResponse.choices[0].message.content;
  
  return responseText ? {
    text: responseText,
    usage: GPTResponse.usage || undefined,
  } : null;
}

/**
 * Send AI response via Stream Chat
 */
async function sendAIResponse(
  channelId: string,
  agentId: string,
  agentName: string,
  response: { text: string }
): Promise<void> {
  await streamChat.upsertUser({
    id: agentId,
    name: agentName,
  });

  const channel = streamChat.channel("messaging", channelId);
  await channel.sendMessage({
    text: response.text,
    user: {
      id: agentId,
      name: agentName,
    },
  });
}

/**
 * Track usage and handle billing
 */
async function trackMessageUsage(
  context: NonNullable<Awaited<ReturnType<typeof getMessageContext>>>,
  userMessage: string,
  aiResponse: { text: string; usage?: OpenAI.Completions.CompletionUsage }
): Promise<void> {
  const { ownerUserId } = context;

  if (!ownerUserId) {
    console.warn('No ownerUserId found for usage tracking');
    return;
  }

  try {
    const creditsClient = await createWebhookCreditsClient();

    // Record AI token usage via tRPC
    const usage = aiResponse.usage;
    if (usage) {
      console.warn('Recording AI usage', {
        ownerUserId,
        total: usage.total_tokens,
        prompt: usage.prompt_tokens,
        completion: usage.completion_tokens,
      });

      await creditsClient.credits.deductAiUsageCredits({
        userId: ownerUserId,
        totalTokens: usage.total_tokens ?? 0,
        promptTokens: usage.prompt_tokens ?? 0,
        completionTokens: usage.completion_tokens ?? 0,
        model: GPT_MODEL,
      });
    }

    // Record platform message fees (for both user and AI messages) via tRPC
    console.warn('Recording chat message usage for user message', {
      ownerUserId,
      messageLength: userMessage.length
    });
    
    await creditsClient.credits.deductChatMessageCredits({
      userId: ownerUserId,
      messageCount: 1,
      channelId: context.targetSessionId,
      messageText: userMessage,
    });
    
    console.warn('Recording chat message usage for AI reply', {
      ownerUserId,
      replyLength: aiResponse.text.length
    });
    
    await creditsClient.credits.deductChatMessageCredits({
      userId: ownerUserId,
      messageCount: 1,
      channelId: context.targetSessionId,
      messageText: aiResponse.text,
    });

  } catch (error) {
    console.error('Failed to track usage:', error);
  }
}
