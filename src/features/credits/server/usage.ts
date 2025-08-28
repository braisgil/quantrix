import { db } from "@/db";
import { creditTransactions, creditsWallets } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { PRICING_CONFIG } from "@/constants/credits";
import { 
  calculateAIUsageCredits, 
  calculateRealtimeCredits, 
  calculateCallCredits,
  calculateChatCredits,
  calculateInngestCredits,
  applyMinimumCredits 
} from "../utils/pricing-helpers";
import { 
  recordUsageAndCharge, 
  getEnvNumber,
  logUsageDebug 
} from "../utils/usage-helpers";
import type { JsonValue } from "../types";

/**
 * Ensure a credits wallet exists for the user
 */
export async function ensureWallet(userId: string): Promise<void> {
  const [wallet] = await db
    .select()
    .from(creditsWallets)
    .where(eq(creditsWallets.userId, userId));
  
  if (!wallet) {
    await db.insert(creditsWallets).values({ userId, balance: 0 });
  }
}

/**
 * Add credits to a user's wallet (for purchases, grants, refunds)
 */
export async function addCredits(
  userId: string, 
  amount: number, 
  description?: string, 
  metadata?: Record<string, JsonValue>,
  transactionType: "purchase" | "refund" | "adjustment" = "adjustment"
): Promise<void> {
  if (amount <= 0) return;
  
  // Atomic upsert + increment to avoid race conditions
  await db
    .insert(creditsWallets)
    .values({ userId, balance: amount })
    .onConflictDoUpdate({
      target: creditsWallets.userId,
      set: {
        balance: sql`${creditsWallets.balance} + ${amount}`,
        updatedAt: new Date(),
      },
    });

  // Record the transaction
  await db.insert(creditTransactions).values({
    userId,
    amount,
    type: transactionType,
    description: description ?? "Credit addition",
    metadata: metadata as unknown,
  });
}

export async function deductCredits(userId: string, amount: number, description?: string, metadata?: Record<string, JsonValue>) {
  const deduct = Math.abs(amount);
  
  try {
    // Ensure wallet exists first
    await ensureWallet(userId);
    
    // Check current balance for better error reporting
    const [currentWallet] = await db
      .select({ balance: creditsWallets.balance })
      .from(creditsWallets)
      .where(eq(creditsWallets.userId, userId));
    
    const currentBalance = currentWallet?.balance ?? 0;
    
    if (currentBalance < deduct) {
      throw new Error(`INSUFFICIENT_CREDITS:${deduct}:${currentBalance}`);
    }

    // Conditional decrement to avoid negative balances; returns updated rows
    const updated = await db
      .update(creditsWallets)
      .set({
        balance: sql`${creditsWallets.balance} - ${deduct}`,
        updatedAt: new Date(),
      })
      .where(and(eq(creditsWallets.userId, userId), sql`${creditsWallets.balance} >= ${deduct}`))
      .returning({ balance: creditsWallets.balance });

    if (updated.length === 0) {
      throw new Error(`INSUFFICIENT_CREDITS:${deduct}:${currentBalance}`);
    }

    await db.insert(creditTransactions).values({
      userId,
      amount: -deduct,
      type: "usage",
      description: description ?? "Usage deduction",
      metadata: metadata as unknown,
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('INSUFFICIENT_CREDITS')) {
      const [, required, available] = error.message.split(':');
      throw new Error(`INSUFFICIENT_CREDITS:${required}:${available}`);
    }
    throw error;
  }
}

export async function recordAiUsageAndCharge(params: {
  userId: string;
  totalTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
  model?: string;
  inputCreditsPerKTokens?: number;
  outputCreditsPerKTokens?: number;
  minimumCredits?: number;
}): Promise<{ creditsDeducted: number }> {
  const {
    userId,
    totalTokens = 0,
    promptTokens = 0,
    completionTokens = 0,
    model = "gpt-4o",
    minimumCredits = getEnvNumber("MIN_CREDITS_PER_CALL", PRICING_CONFIG.MIN_CREDITS_PER_CALL),
    inputCreditsPerKTokens,
    outputCreditsPerKTokens,
  } = params;

  // Calculate AI usage credits
  const calculation = calculateAIUsageCredits({
    promptTokens,
    completionTokens,
    model,
    inputCreditsPerKTokens,
    outputCreditsPerKTokens,
  });

  const creditsToDeduct = applyMinimumCredits(calculation.totalCreditsRaw, minimumCredits);

  // Debug logging
  logUsageDebug("ai_usage", userId, {
    model,
    totalTokens,
    promptTokens,
    completionTokens,
    ...calculation,
    creditsToDeduct,
  });

  // Record usage and charge
  await recordUsageAndCharge({
    userId,
    creditsToDeduct,
    description: "AI usage",
    metadata: {
      model,
      totalTokens,
      promptTokens,
      completionTokens,
      ...calculation,
    },
    eventName: "ai_usage",
    eventMetadata: {
      model,
      total_tokens: totalTokens,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      input_credits_per_k: calculation.inputCreditsPerK,
      output_credits_per_k: calculation.outputCreditsPerK,
      input_credits_raw: calculation.inputCreditsRaw,
      output_credits_raw: calculation.outputCreditsRaw,
      total_credits_raw: calculation.totalCreditsRaw,
      credits_charged: creditsToDeduct,
    },
  });

  return { creditsDeducted: creditsToDeduct };
}

export async function recordRealtimeApiUsageAndCharge(params: {
  userId: string;
  totalTokens?: number;
  inputTokens?: number;
  outputTokens?: number;
  model?: string;
  sessionDurationMs?: number;
}): Promise<{ creditsDeducted: number }> {
  const {
    userId,
    totalTokens = 0,
    inputTokens = 0,
    outputTokens = 0,
    model = "gpt-4o-realtime",
    sessionDurationMs = 0,
  } = params;

  const minimumCredits = getEnvNumber("REALTIME_MIN_CREDITS_PER_CALL", PRICING_CONFIG.REALTIME.MIN_CREDITS_PER_CALL);
  const calculation = calculateRealtimeCredits({ inputTokens, outputTokens });
  const creditsToDeduct = applyMinimumCredits(calculation.totalCredits, minimumCredits);

  // Debug logging
  logUsageDebug("realtime_api_usage", userId, {
    model,
    totalTokens,
    inputTokens,
    outputTokens,
    sessionDurationMs,
    ...calculation,
    creditsToDeduct,
  });

  // Record usage and charge
  await recordUsageAndCharge({
    userId,
    creditsToDeduct,
    description: "Real-time API usage",
    metadata: {
      model,
      totalTokens,
      inputTokens,
      outputTokens,
      sessionDurationMs,
      ...calculation,
    },
    eventName: "realtime_api_usage",
    eventMetadata: {
      model,
      total_tokens: totalTokens,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      session_duration_ms: sessionDurationMs,
      input_credits_per_k: PRICING_CONFIG.REALTIME.INPUT_CREDITS_PER_K_TOKENS,
      output_credits_per_k: PRICING_CONFIG.REALTIME.OUTPUT_CREDITS_PER_K_TOKENS,
      input_credits: calculation.inputCredits,
      output_credits: calculation.outputCredits,
      credits_charged: creditsToDeduct,
    },
  });

  return { creditsDeducted: creditsToDeduct };
}

export async function recordCallUsageAndCharge(params: {
  userId: string;
  callDurationMs: number;
  participantCount: number; // Always 2 (AI agent + user), kept for logging
  callId: string;
  conversationId: string;
  hasTranscription?: boolean;
}): Promise<{ creditsDeducted: number }> {
  const {
    userId,
    callDurationMs,
    participantCount,
    callId,
    conversationId,
    hasTranscription = false,
  } = params;

  const minimumCredits = getEnvNumber("MIN_CREDITS_PER_CALL_SESSION", PRICING_CONFIG.VIDEO_CALLS.MIN_CREDITS_PER_SESSION);
  const calculation = calculateCallCredits({ callDurationMs, hasTranscription });
  const creditsToDeduct = applyMinimumCredits(calculation.totalCredits, minimumCredits);

  // Debug logging
  logUsageDebug("call_usage", userId, {
    callId,
    conversationId,
    callDurationMs,
    participantCount, // Always 2
    hasTranscription,
    ...calculation,
    creditsToDeduct,
  });

  // Record usage and charge
  await recordUsageAndCharge({
    userId,
    creditsToDeduct,
    description: "Call service usage",
    metadata: {
      callId,
      conversationId,
      callDurationMs,
      participantCount, // Always 2
      ...calculation,
      hasTranscription,
    },
    eventName: "call_usage",
    eventMetadata: {
      call_id: callId,
      conversation_id: conversationId,
      duration_ms: callDurationMs,
      duration_minutes: calculation.callMinutes,
      participant_count: participantCount, // Always 2
      has_transcription: hasTranscription,
      call_credits: calculation.callCredits,
      transcription_credits: calculation.transcriptionCredits,
      credits_charged: creditsToDeduct,
    },
  });

  return { creditsDeducted: creditsToDeduct };
}

export async function recordTranscriptionUsageAndCharge(params: {
  userId: string;
  callDurationMs: number;
  callId: string;
  conversationId: string;
}): Promise<{ creditsDeducted: number }> {
  const {
    userId,
    callDurationMs,
    callId,
    conversationId,
  } = params;

  const minimumCredits = getEnvNumber("MIN_CREDITS_PER_CALL_SESSION", PRICING_CONFIG.VIDEO_CALLS.MIN_CREDITS_PER_SESSION);
  const callMinutes = Math.ceil(callDurationMs / (1000 * 60));
  const transcriptionCredits = callMinutes * PRICING_CONFIG.TRANSCRIPTION.CREDITS_PER_MINUTE;
  const creditsToDeduct = applyMinimumCredits(transcriptionCredits, minimumCredits);

  // Debug logging
  logUsageDebug("transcription_usage", userId, {
    callId,
    conversationId,
    callDurationMs,
    callMinutes,
    transcriptionCredits,
    creditsToDeduct,
  });

  // Record usage and charge
  await recordUsageAndCharge({
    userId,
    creditsToDeduct,
    description: "Call transcription service",
    metadata: {
      callId,
      conversationId,
      callDurationMs,
      callMinutes,
      transcriptionCredits,
    },
    eventName: "transcription_usage",
    eventMetadata: {
      call_id: callId,
      conversation_id: conversationId,
      duration_ms: callDurationMs,
      duration_minutes: callMinutes,
      credits_charged: creditsToDeduct,
    },
  });

  return { creditsDeducted: creditsToDeduct };
}

export async function recordChatMessageUsageAndCharge(params: {
  userId: string;
  messageCount: number;
  channelId: string;
  messageText?: string;
}): Promise<{ creditsDeducted: number }> {
  const {
    userId,
    messageCount,
    channelId,
    messageText = "",
  } = params;

  const minimumCredits = getEnvNumber("MIN_CREDITS_PER_MESSAGE", PRICING_CONFIG.CHAT.MIN_CREDITS_PER_MESSAGE);
  const messageCredits = calculateChatCredits(messageCount);
  const creditsToDeduct = applyMinimumCredits(messageCredits, minimumCredits);

  // Debug logging
  logUsageDebug("chat_message_usage", userId, {
    channelId,
    messageCount,
    creditsPerMessage: PRICING_CONFIG.CHAT.CREDITS_PER_MESSAGE,
    messageCredits,
    creditsToDeduct,
  });

  // Record usage and charge
  await recordUsageAndCharge({
    userId,
    creditsToDeduct,
    description: "Chat message usage",
    metadata: {
      channelId,
      messageCount,
      messageCredits,
      creditsPerMessage: PRICING_CONFIG.CHAT.CREDITS_PER_MESSAGE,
    },
    eventName: "chat_message_usage",
    eventMetadata: {
      channel_id: channelId,
      message_count: messageCount,
      message_length: messageText.length,
      credits_per_message: PRICING_CONFIG.CHAT.CREDITS_PER_MESSAGE,
      credits_charged: creditsToDeduct,
    },
  });

  return { creditsDeducted: creditsToDeduct };
}

export async function recordInngestUsageAndCharge(params: {
  userId: string;
  functionName: string;
  executionTimeMs: number;
  metadata?: Record<string, JsonValue>;
}): Promise<{ creditsDeducted: number }> {
  const { userId, functionName, executionTimeMs, metadata = {} } = params;

  const creditsToDeduct = calculateInngestCredits(executionTimeMs);
  const seconds = Math.ceil(executionTimeMs / 1000);

  // Debug logging
  logUsageDebug("inngest_usage", userId, {
    functionName,
    executionTimeMs,
    seconds,
    baseCredits: PRICING_CONFIG.INNGEST.BASE_CREDITS_PER_EXECUTION,
    perSecondCredits: PRICING_CONFIG.INNGEST.CREDITS_PER_SECOND,
    creditsToDeduct,
  });

  // Record usage and charge
  await recordUsageAndCharge({
    userId,
    creditsToDeduct,
    description: "Background job execution",
    metadata: {
      functionName,
      executionTimeMs,
      seconds,
      base: PRICING_CONFIG.INNGEST.BASE_CREDITS_PER_EXECUTION,
      perSecond: PRICING_CONFIG.INNGEST.CREDITS_PER_SECOND,
      ...metadata,
    },
    eventName: "inngest_usage",
    eventMetadata: {
      function_name: functionName,
      execution_ms: executionTimeMs,
      seconds,
      base_credits: PRICING_CONFIG.INNGEST.BASE_CREDITS_PER_EXECUTION,
      per_second_credits: PRICING_CONFIG.INNGEST.CREDITS_PER_SECOND,
      credits_charged: creditsToDeduct,
      ...Object.fromEntries(
        Object.entries(metadata).map(([k, v]) => [k, typeof v === 'object' ? JSON.stringify(v) : v])
      ),
    },
  });

  return { creditsDeducted: creditsToDeduct };
}
