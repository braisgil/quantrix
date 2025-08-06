import { useTRPC } from "@/trpc/client";
import { SessionStatus } from "../types";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useQuerySessions = (params?: {
  search?: string;
  agentId?: string;
  status?: SessionStatus;
}) => {
  const trpc = useTRPC();
  
  return useSuspenseQuery({
    ...trpc.sessions.getMany.queryOptions(params || {}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};