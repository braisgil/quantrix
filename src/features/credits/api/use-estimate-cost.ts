import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

type OpenAIOperation = {
  type: "openai";
  model: "gpt-4o" | "gpt-4o-mini";
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
};

type StreamOperation = {
  type: "stream";
  service: "video_call" | "chat_message" | "transcription";
  quantity: number;
};

export const useEstimateCreditCost = (
  operations: (OpenAIOperation | StreamOperation)[],
  enabled = true
) => {
  const trpc = useTRPC();
  
  return useQuery({
    ...trpc.credits.estimateCost.queryOptions({ operations }),
    enabled: enabled && operations.length > 0,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useCheckSufficientCredits = (requiredCredits: number, enabled = true) => {
  const trpc = useTRPC();
  
  return useQuery({
    ...trpc.credits.checkSufficientCredits.queryOptions({ requiredCredits }),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
};

