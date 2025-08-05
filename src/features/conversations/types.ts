import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

export type ConversationGetMany = inferRouterOutputs<AppRouter>["conversations"]["getMany"]["items"];
export type ConversationGetOne = inferRouterOutputs<AppRouter>["conversations"]["getOne"];

export enum ConversationStatus {
  Upcoming = "upcoming",
  Active = "active",
  Completed = "completed",
  Processing = "processing",
  Cancelled = "cancelled",
};

export type StreamTranscriptItem = {
  speaker_id: string;
  type: string;
  text: string;
  start_ts: number;
  stop_ts: number;
};
