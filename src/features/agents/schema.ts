import { z } from "zod";

export const agentsInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().max(75, { message: "Description must be 75 characters or less" }).optional(),
  instructions: z.string().min(1, { message: "Instructions are required" }),
  category: z.string().min(1, { message: "Category is required" }),
  subcategory: z.string().min(1, { message: "Subcategory is required" }),
  subSubcategory: z.string().min(1, { message: "Sub-subcategory is required" }),
  customRule1: z.string().min(1, { message: "Communication style is required" }),
  customRule2: z.string().min(1, { message: "Learning approach is required" }),
  additionalRule1: z.string().optional(),
  additionalRule2: z.string().optional(),
});

export const agentsUpdateSchema = agentsInsertSchema.extend({
  id: z.string().min(1, { message: "Id is required" }),
});

export type AgentInsert = z.infer<typeof agentsInsertSchema>;
export type AgentUpdate = z.infer<typeof agentsUpdateSchema>; 