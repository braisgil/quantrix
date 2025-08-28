/**
 * Pricing calculation helpers
 */
import { PRICING_CONFIG } from '@/constants/credits';

/**
 * Calculate AI usage credits based on token consumption
 */
export function calculateAIUsageCredits(params: {
  promptTokens: number;
  completionTokens: number;
  model?: string;
  inputCreditsPerKTokens?: number;
  outputCreditsPerKTokens?: number;
}) {
  const {
    promptTokens = 0,
    completionTokens = 0,
    model = "gpt-4o",
    inputCreditsPerKTokens,
    outputCreditsPerKTokens,
  } = params;

  // Determine pricing based on model and overrides
  let inputCreditsPerK: number;
  let outputCreditsPerK: number;

  if (inputCreditsPerKTokens && outputCreditsPerKTokens) {
    inputCreditsPerK = inputCreditsPerKTokens;
    outputCreditsPerK = outputCreditsPerKTokens;
  } else if (model.includes('gpt-4o')) {
    inputCreditsPerK = PRICING_CONFIG.GPT4O.INPUT_CREDITS_PER_K_TOKENS;
    outputCreditsPerK = PRICING_CONFIG.GPT4O.OUTPUT_CREDITS_PER_K_TOKENS;
  } else {
    inputCreditsPerK = PRICING_CONFIG.FALLBACK_CREDITS_PER_K_TOKENS;
    outputCreditsPerK = PRICING_CONFIG.FALLBACK_CREDITS_PER_K_TOKENS;
  }

  const inputCreditsRaw = (promptTokens / 1000) * inputCreditsPerK;
  const outputCreditsRaw = (completionTokens / 1000) * outputCreditsPerK;
  const totalCreditsRaw = inputCreditsRaw + outputCreditsRaw;

  return {
    inputCreditsPerK,
    outputCreditsPerK,
    inputCreditsRaw,
    outputCreditsRaw,
    totalCreditsRaw,
  };
}

/**
 * Calculate realtime API usage credits
 */
export function calculateRealtimeCredits(params: {
  inputTokens: number;
  outputTokens: number;
}) {
  const { inputTokens = 0, outputTokens = 0 } = params;
  
  const inputCredits = Math.ceil((inputTokens / 1000) * PRICING_CONFIG.REALTIME.INPUT_CREDITS_PER_K_TOKENS);
  const outputCredits = Math.ceil((outputTokens / 1000) * PRICING_CONFIG.REALTIME.OUTPUT_CREDITS_PER_K_TOKENS);
  
  return {
    inputCredits,
    outputCredits,
    totalCredits: inputCredits + outputCredits,
  };
}

/**
 * Calculate call usage credits
 */
export function calculateCallCredits(params: {
  callDurationMs: number;
  hasTranscription?: boolean;
}) {
  const { callDurationMs, hasTranscription = false } = params;
  
  const callMinutes = Math.ceil(callDurationMs / (1000 * 60));
  const callCredits = callMinutes * PRICING_CONFIG.VIDEO_CALLS.CREDITS_PER_MINUTE;
  const transcriptionCredits = hasTranscription 
    ? callMinutes * PRICING_CONFIG.TRANSCRIPTION.CREDITS_PER_MINUTE 
    : 0;
  
  return {
    callMinutes,
    callCredits,
    transcriptionCredits,
    totalCredits: callCredits + transcriptionCredits,
  };
}

/**
 * Calculate chat message credits
 */
export function calculateChatCredits(messageCount: number): number {
  return messageCount * PRICING_CONFIG.CHAT.CREDITS_PER_MESSAGE;
}

/**
 * Calculate Inngest execution credits
 */
export function calculateInngestCredits(executionTimeMs: number): number {
  const seconds = Math.ceil(executionTimeMs / 1000);
  const variableCredits = PRICING_CONFIG.INNGEST.CREDITS_PER_SECOND * seconds;
  return Math.ceil(PRICING_CONFIG.INNGEST.BASE_CREDITS_PER_EXECUTION + variableCredits);
}

/**
 * Apply minimum credit requirements
 */
export function applyMinimumCredits(
  calculatedCredits: number, 
  minimumCredits: number
): number {
  return Math.max(minimumCredits, Math.ceil(calculatedCredits));
}
