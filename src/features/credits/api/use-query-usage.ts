import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useQueryCreditUsage = (options?: {
  limit?: number;
  offset?: number;
  service?: "openai_gpt4o" | "openai_gpt4o_mini" | "stream_video_call" | "stream_chat_message" | "stream_transcription";
  startDate?: string;
  endDate?: string;
}) => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.credits.getUsageHistory.queryOptions({
      limit: options?.limit ?? 50,
      offset: options?.offset ?? 0,
      service: options?.service,
      startDate: options?.startDate,
      endDate: options?.endDate,
    }),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useQueryCreditUsageStats = (period: "day" | "week" | "month" | "all" = "month") => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.credits.getUsageStats.queryOptions({ period }),
    staleTime: 60 * 1000, // 1 minute
  });
};

