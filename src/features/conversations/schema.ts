import { z } from "zod";

export const conversationsInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  agentId: z.string().min(1, { message: "Agent is required" }),
  scheduledDateTime: z.date().optional(),
});

export const conversationsUpdateSchema = conversationsInsertSchema.extend({
  id: z.string().min(1, { message: "Id is required" }),
});
