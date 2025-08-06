import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

export type SessionGetMany = inferRouterOutputs<AppRouter>["sessions"]["getMany"]["items"];
export type SessionGetOne = inferRouterOutputs<AppRouter>["sessions"]["getOne"];

export enum SessionStatus {
  Active = "active",
  Archived = "archived",
  Completed = "completed",
}



// Type for session data from the database
export interface Session {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  agentId: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}