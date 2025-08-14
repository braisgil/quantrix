import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

// Unified, standardized types inferred from tRPC router
export type SessionList = inferRouterOutputs<AppRouter>["sessions"]["getMany"]["items"];
export type SessionItem = SessionList[number];
export type SessionDetail = inferRouterOutputs<AppRouter>["sessions"]["getOne"];

export enum SessionStatus {
  Active = "active",
  Archived = "archived",
  Completed = "completed",
}

export const SESSION_STATUS_VALUES = [
  SessionStatus.Active,
  SessionStatus.Archived,
  SessionStatus.Completed,
] as const;

// Backward-compatible aliases (to be gradually migrated away from)
// (Removed legacy aliases SessionGetMany/SessionGetOne)