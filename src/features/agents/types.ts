import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";


// Unified, standardized types inferred from tRPC router
export type AgentList = inferRouterOutputs<AppRouter>["agents"]["getMany"]["items"];
export type AgentItem = AgentList[number];
export type AgentDetail = inferRouterOutputs<AppRouter>["agents"]["getOne"];