import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

// Type for agent data from the database
export interface Agent {
  id: string;
  name: string;
  userId: string;
  instructions: string;
  category: string;
  subcategory: string;
  subSubcategory: string;
  customRule1: string;
  customRule2: string;
  additionalRule1: string | null;
  additionalRule2: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AgentsGetMany = inferRouterOutputs<AppRouter>["agents"]["getMany"]["items"];
export type AgentsGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"];
