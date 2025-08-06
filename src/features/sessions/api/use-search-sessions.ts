import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const useSearchSessions = (search?: string) => {
  const trpc = useTRPC();
  
  return useQuery({
    ...trpc.sessions.getMany.queryOptions({ search }),
    enabled: Boolean(search && search.trim().length > 0), // Only fetch when there's a search term
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for search results)
    gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
  });
};