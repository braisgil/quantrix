import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

// Unified, standardized types inferred from tRPC router
export type ConversationList = inferRouterOutputs<AppRouter>["conversations"]["getMany"]["items"];
export type ConversationItem = ConversationList[number];
export type ConversationDetail = inferRouterOutputs<AppRouter>["conversations"]["getOne"];
// Optional availability decoration is handled at usage sites; avoid embedded union types here

export enum ConversationStatus {
  Scheduled = "scheduled",
  Available = "available",
  Active = "active",
  Completed = "completed",
  Processing = "processing",
  Cancelled = "cancelled",
};

export const CONVERSATION_STATUS_VALUES = [
  ConversationStatus.Scheduled,
  ConversationStatus.Available,
  ConversationStatus.Active,
  ConversationStatus.Completed,
  ConversationStatus.Processing,
  ConversationStatus.Cancelled,
] as const;

export type StreamTranscriptItem = {
  speaker_id: string;
  type: string;
  text: string;
  start_ts: number;
  stop_ts: number;
};

// Backward-compatible aliases (to be gradually migrated away from)
// (Removed legacy aliases ConversationGetMany/ConversationGetOne)
