'use client'

import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { 
  Code, 
  Zap,
  Search,
  Terminal,
  Loader2,
  Sparkles,
  MessageSquare
} from "lucide-react";

import { 
  Command,
  CommandInput, 
  CommandItem, 
  CommandList,
  CommandGroup,
  CommandEmpty
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useSearchAgents } from "@/features/agents/api/use-search-agents";
import { useSearchConversations } from "@/features/conversations/api/use-search-conversations";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const { search, debouncedSearch, setSearch, isSearching } = useDebouncedSearch();
  const { data: agents, isLoading: agentsLoading } = useSearchAgents(debouncedSearch);
  const { data: conversations, isLoading: conversationsLoading } = useSearchConversations(debouncedSearch);

  const hasAgentResults = agents && agents.items.length > 0;
  const hasConversationResults = conversations && conversations.items.length > 0;
  const isSearchActive = search && search.trim().length > 0;
  const showLoading = isSearchActive && (isSearching || agentsLoading || conversationsLoading);



  const handleNavigation = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="relative">
        <Sparkles className="h-8 w-8 text-primary animate-bounce" />
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-foreground animate-pulse">Searching...</p>
        <p className="text-xs text-muted-foreground mt-1">AI is analyzing your query</p>
      </div>
    </div>
  );

  const EmptyState = () => (
    <CommandEmpty className="py-8 text-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="p-3 bg-muted/50 rounded-xl border border-border/50 hover:bg-muted/70 transition-colors duration-300">
          <Search className="h-8 w-8 text-muted-foreground animate-pulse" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">No results found</p>
          <p className="text-xs text-muted-foreground">
            Try searching for different keywords or create a new companion
          </p>
        </div>
      </div>
    </CommandEmpty>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-border bg-gradient-to-b from-background/95 to-background/90 backdrop-blur-md overflow-hidden p-0 max-w-2xl shadow-2xl ring-1 ring-primary/10">
        <DialogTitle className="sr-only">Search Command</DialogTitle>
        <DialogDescription className="sr-only">
          Search for AI companions, conversations, or access quick actions
        </DialogDescription>
        <Command shouldFilter={false} className="bg-transparent">
          {/* Search Header */}
          <div className="flex items-center border-b border-border/60 px-4 py-3 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
            <div className="flex items-center space-x-3 flex-1">
              {showLoading ? (
                <div className="relative">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <div className="absolute inset-0 h-5 w-5 rounded-full bg-primary/20 animate-ping" />
                </div>
              ) : (
                <Terminal className="h-5 w-5 text-primary drop-shadow-sm" />
              )}
              <CommandInput
                placeholder="Search AI companions, conversations..."
                value={search}
                onValueChange={setSearch}
                className="border-0 focus:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground text-base transition-all duration-200 focus:placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {/* Results */}
          <CommandList className="max-h-[400px] scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
            {showLoading ? (
              <LoadingState />
            ) : (
              <>
                {!hasAgentResults && !hasConversationResults && isSearchActive && (
                  <EmptyState />
                )}

                {/* AI Companions Results */}
                {hasAgentResults && (
                  <CommandGroup heading="AI Companions" className="px-2 py-3">
                    {agents?.items.map((agent) => (
                      <CommandItem
                        key={agent.id}
                        onSelect={() => handleNavigation(`/agents/${agent.id}`)}
                        className="group flex items-center space-x-4 px-4 py-3 mx-2 rounded-lg hover:bg-accent/50 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer border border-transparent hover:border-border/50"
                      >
                        <div className="p-2 bg-muted/50 rounded-lg group-hover:bg-accent group-hover:shadow-sm transition-all duration-200 border border-border/50">
                          <Code className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                        </div>
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                            {agent.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                              {agent.name}
                            </p>
                            <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-200">
                              AI Companion • Ready to chat
                            </p>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0 translate-x-2">
                          <div className="text-xs text-primary font-medium">Enter →</div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* Conversations Results */}
                {hasConversationResults && (
                  <CommandGroup heading="Conversations" className="px-2 py-3">
                    {conversations?.items.map((conversation) => (
                      <CommandItem
                        key={conversation.id}
                        onSelect={() => handleNavigation(`/conversations/${conversation.id}`)}
                        className="group flex items-center space-x-4 px-4 py-3 mx-2 rounded-lg hover:bg-accent/50 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer border border-transparent hover:border-border/50"
                      >
                        <div className="p-2 bg-muted/50 rounded-lg group-hover:bg-accent group-hover:shadow-sm transition-all duration-200 border border-border/50">
                          <MessageSquare className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                        </div>
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                            {conversation.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                              {conversation.name}
                            </p>
                            <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-200">
                              with {conversation.agent.name} • {conversation.status}
                            </p>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0 translate-x-2">
                          <div className="text-xs text-primary font-medium">Enter →</div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* Quick Actions - Only show when no search */}
                {!isSearchActive && (
                  <CommandGroup heading="Quick Actions" className="px-2 py-3">
                    <CommandItem
                      onSelect={() => handleNavigation("/conversations")}
                      className="group flex items-center space-x-4 px-4 py-3 mx-2 rounded-lg hover:bg-accent/50 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer border border-transparent hover:border-border/50"
                    >
                      <div className="p-2 bg-muted/50 rounded-lg group-hover:bg-accent group-hover:shadow-sm transition-all duration-200 border border-border/50">
                        <Zap className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                          Start New Conversation
                        </p>
                        <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-200">
                          Begin chatting with an AI companion
                        </p>
                      </div>
                    </CommandItem>
                    
                    <CommandItem
                      onSelect={() => handleNavigation("/agents")}
                      className="group flex items-center space-x-4 px-4 py-3 mx-2 rounded-lg hover:bg-accent/50 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer border border-transparent hover:border-border/50"
                    >
                      <div className="p-2 bg-muted/50 rounded-lg group-hover:bg-accent group-hover:shadow-sm transition-all duration-200 border border-border/50">
                        <Terminal className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                          Create New Companion
                        </p>
                        <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-200">
                          Design your perfect AI assistant
                        </p>
                      </div>
                    </CommandItem>
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
