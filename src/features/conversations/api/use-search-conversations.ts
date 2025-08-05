import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { useDebouncedSearch } from '@/hooks/use-debounced-search';

export const useSearchConversations = () => {
  const trpc = useTRPC();
  const { search, setSearch, debouncedSearch } = useDebouncedSearch();
  
  const query = useQuery({
    ...trpc.conversations.getMany.queryOptions({ search: debouncedSearch }),
    enabled: debouncedSearch.length > 0,
  });

  return {
    search,
    setSearch,
    ...query,
  };
}; 