import { CreditMeteringService } from "./metering";

interface ChatCompletionUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

/**
 * Track OpenAI API usage and deduct credits
 */
export class OpenAIUsageTracker {
  static async trackCompletion(params: {
    userId: string;
    model: "gpt-4o" | "gpt-4o-mini";
    usage: ChatCompletionUsage;
    conversationId?: string;
    sessionId?: string;
  }) {
    const { userId, model, usage, conversationId, sessionId } = params;

    const service = model === "gpt-4o" ? "openai_gpt4o" : "openai_gpt4o_mini";

    return await CreditMeteringService.trackUsage({
      userId,
      service,
      quantity: usage.total_tokens || 0,
      resourceId: conversationId || sessionId,
      resourceType: conversationId ? "conversation" : sessionId ? "session" : undefined,
      metadata: {
        model,
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        inputTokens: usage.prompt_tokens,
        outputTokens: usage.completion_tokens,
      },
    });
  }

  /**
   * Estimate cost before making an API call
   */
  static async estimateCost(params: {
    model: "gpt-4o" | "gpt-4o-mini";
    estimatedInputTokens: number;
    estimatedOutputTokens: number;
  }) {
    return await CreditMeteringService.estimateOpenAICost(
      params.model,
      params.estimatedInputTokens,
      params.estimatedOutputTokens
    );
  }
}

/**
 * Track GetStream.io usage and deduct credits
 */
export class StreamUsageTracker {
  /**
   * Track video call usage
   */
  static async trackVideoCall(params: {
    userId: string;
    durationMinutes: number;
    conversationId: string;
  }) {
    const { userId, durationMinutes, conversationId } = params;

    return await CreditMeteringService.trackUsage({
      userId,
      service: "stream_video_call",
      quantity: Math.ceil(durationMinutes), // Round up to nearest minute
      resourceId: conversationId,
      resourceType: "conversation",
      metadata: {
        durationMinutes,
        roundedMinutes: Math.ceil(durationMinutes),
      },
    });
  }

  /**
   * Track chat message usage
   */
  static async trackChatMessage(params: {
    userId: string;
    messageCount: number;
    channelId: string;
    sessionId?: string;
  }) {
    const { userId, messageCount, channelId, sessionId } = params;

    return await CreditMeteringService.trackUsage({
      userId,
      service: "stream_chat_message",
      quantity: messageCount,
      resourceId: channelId,
      resourceType: sessionId ? "session" : "chat",
      metadata: {
        channelId,
        sessionId,
        messageCount,
      },
    });
  }

  /**
   * Track transcription usage
   */
  static async trackTranscription(params: {
    userId: string;
    durationMinutes: number;
    conversationId: string;
  }) {
    const { userId, durationMinutes, conversationId } = params;

    return await CreditMeteringService.trackUsage({
      userId,
      service: "stream_transcription",
      quantity: Math.ceil(durationMinutes),
      resourceId: conversationId,
      resourceType: "conversation",
      metadata: {
        durationMinutes,
        roundedMinutes: Math.ceil(durationMinutes),
      },
    });
  }


  /**
   * Estimate costs for Stream services
   */
  static async estimateVideoCallCost(durationMinutes: number) {
    return await CreditMeteringService.estimateStreamCost("video_call", Math.ceil(durationMinutes));
  }

  static async estimateChatCost(messageCount: number) {
    return await CreditMeteringService.estimateStreamCost("chat_message", messageCount);
  }

  static async estimateTranscriptionCost(durationMinutes: number) {
    return await CreditMeteringService.estimateStreamCost("transcription", Math.ceil(durationMinutes));
  }

}

/**
 * Central usage tracking facade
 */
export class UsageTracker {
  static openai = OpenAIUsageTracker;
  static stream = StreamUsageTracker;

  /**
   * Check if user has sufficient credits for an operation
   */
  static async canAfford(userId: string, estimatedCredits: number): Promise<boolean> {
    const balance = await CreditMeteringService.getUserBalance(userId);
    return balance.availableCredits.greaterThanOrEqualTo(estimatedCredits);
  }

  /**
   * Get user's credit balance
   */
  static async getBalance(userId: string) {
    return await CreditMeteringService.getUserBalance(userId);
  }
}