import { z } from "zod";

// Schema for creating a new session
export const sessionsInsertSchema = z.object({
  name: z.string().min(1, "Session name is required"),
  description: z.string().nullable().optional(),
  agentId: z.string().min(1, "Agent is required"),
});

// Schema for updating a session
export const sessionsUpdateSchema = z.object({
  name: z.string().min(1, "Session name is required").optional(),
  description: z.string().nullable().optional(),
  status: z.enum(["active", "archived", "completed"]).optional(),
});

export type SessionsInsertSchema = z.infer<typeof sessionsInsertSchema>;
export type SessionsUpdateSchema = z.infer<typeof sessionsUpdateSchema>;