import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export const useSearchAgents = (search: string) => {
  const trpc = useTRPC();
  const isEnabled = Boolean(search && search.trim().length > 0);
  
  return useQuery({
    ...trpc.agents.getMany.queryOptions({ search }),
    enabled: isEnabled, // Only fetch when there's a search term
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for search results)
    gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
  });
};