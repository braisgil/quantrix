'use client'
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { 
  Code, 
  Zap,
  Search,
  Terminal,
  Loader2
} from "lucide-react";

import { 
  CommandInput, 
  CommandItem, 
  CommandList,
  CommandGroup,
  CommandEmpty,
  CommandDialog
} from "@/components/ui/command";
import { useQueryAgents } from "@/features/agents/api/use-query-agents";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DashboardCommand = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const { search, debouncedSearch, setSearch, isSearching } = useDebouncedSearch();
  const agents = useQueryAgents(debouncedSearch);

  return (
    <CommandDialog 
      open={open} 
      onOpenChange={setOpen}
      className="matrix-card border-primary/30"
    >
      <div className="flex items-center border-b border-primary/20 px-3">
        {isSearching ? (
          <Loader2 className="mr-2 h-4 w-4 shrink-0 text-primary animate-spin" />
        ) : (
          <Terminal className="mr-2 h-4 w-4 shrink-0 text-primary" />
        )}
        <CommandInput
          placeholder="Search companions, sessions..."
          value={search}
          onValueChange={(value) => setSearch(value)}
          className="border-0 focus:ring-0 text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <CommandList className="max-h-[300px]">
        <CommandEmpty className="py-6 text-center text-sm">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <span className="text-muted-foreground">
              No results found
            </span>
            <span className="text-xs text-muted-foreground">
              Try searching for &quot;companion&quot;, &quot;session&quot;, or &quot;conversation&quot;
            </span>
          </div>
        </CommandEmpty>
        
        {/*filteredSessions.length > 0 && (
          <CommandGroup heading="Recent Sessions">
            {filteredSessions.map((session) => (
              <CommandItem
                onSelect={() => {
                  router.push(`/sessions/${session.id}`);
                  setOpen(false);
                }}
                key={session.id}
                className="flex items-center space-x-3 px-3 py-2 hover:bg-primary/10 hover:matrix-border transition-all duration-300"
              >
                <div className="p-1.5 bg-primary/10 rounded-lg matrix-glow">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{session.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) */}

        {agents.data?.items && agents.data?.items.length > 0 && (
          <CommandGroup heading="AI Companions">
            {agents.data?.items.map((agent) => (
              <CommandItem
                onSelect={() => {
                  router.push(`/agents/${agent.id}`);
                  setOpen(false);
                }}
                key={agent.id}
                className="flex items-center space-x-3 px-3 py-2 hover:bg-primary/10 hover:matrix-border transition-all duration-300"
              >
                <div className="p-1.5 bg-primary/10 rounded-lg matrix-glow">
                  <Code className="h-4 w-4 text-primary" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-xs font-bold text-black">
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{agent.name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {search && agents.data?.items.length === 0 && (
          <CommandGroup heading="Quick Actions">
            <CommandItem
              onSelect={() => {
                router.push("/sessions");
                setOpen(false);
              }}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-primary/10 hover:matrix-border transition-all duration-300"
            >
              <div className="p-1.5 bg-primary/10 rounded-lg matrix-glow">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Start New Conversation</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/agents");
                setOpen(false);
              }}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-primary/10 hover:matrix-border transition-all duration-300"
            >
              <div className="p-1.5 bg-primary/10 rounded-lg matrix-glow">
                <Terminal className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Create New Companion</span>
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};
