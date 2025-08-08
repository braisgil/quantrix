import { useState } from "react";
import { FolderOpen, Search, Bot, Loader2, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useSearchAgents } from "@/features/agents/api/use-search-agents";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { useIsMobile } from "@/hooks/use-mobile";
import type { StepProps } from "../../types/wizard";
import { formatCategoryName } from "@/features/agents/utils/category-helpers";
import { WizardLayout } from "../shared/wizard-layout";

export const StepSessionDetails = ({ wizardState, updateWizardState }: StepProps) => {
  const [isAgentPopoverOpen, setIsAgentPopoverOpen] = useState(false);
  
  const isMobile = useIsMobile();
  const { search, debouncedSearch, setSearch, isSearching } = useDebouncedSearch();
  const { data: agentsData, isLoading } = useSearchAgents(debouncedSearch);
  const agents = agentsData?.items || [];

  const isSearchActive = search && search.trim().length > 0;
  const showLoading = isSearchActive && (isSearching || isLoading);

  const handleAgentSelect = (agentId: string) => {
    updateWizardState({ agentId });
    setIsAgentPopoverOpen(false);
  };

  const selectedAgent = agents.find(agent => agent.id === wizardState.agentId);

  return (
    <WizardLayout
      title="Session Details"
      description="Create a session to organize your conversations by topic"
      icon={FolderOpen}
    >
      <div className="space-y-6">
        {/* Session Name */}
        <div className="space-y-2">
          <Label htmlFor="session-name" className="text-sm font-medium text-primary">
            Session Name
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10">
              <FolderOpen className="w-4 h-4 text-primary" strokeWidth={2} />
            </div>
            <Input
              id="session-name"
              type="text"
              placeholder="e.g., IELTS Exam Preparation"
              value={wizardState.name}
              onChange={(e) => updateWizardState({ name: e.target.value })}
              className="pl-10 matrix-border bg-background/50 backdrop-blur-sm"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Give your session a descriptive name that represents the topic
          </p>
        </div>

        {/* Session Description */}
        <div className="space-y-2">
          <Label htmlFor="session-description" className="text-sm font-medium text-primary">
            Description (Optional)
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-3 w-4 h-4 z-10">
              <FileText className="w-4 h-4 text-primary" strokeWidth={2} />
            </div>
            <Textarea
              id="session-description"
              placeholder="Describe what this session is about..."
              value={wizardState.description}
              onChange={(e) => updateWizardState({ description: e.target.value })}
              className="pl-10 min-h-[100px] matrix-border bg-background/50 backdrop-blur-sm resize-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Add a description to help you remember the purpose of this session
          </p>
        </div>

        {/* Agent Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-primary">
            Select AI Companion
          </Label>
          <Popover open={isAgentPopoverOpen} onOpenChange={setIsAgentPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isAgentPopoverOpen}
                className="w-full justify-between matrix-border bg-background/50 backdrop-blur-sm hover:bg-accent/50"
              >
                {selectedAgent ? (
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="truncate">{selectedAgent.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Bot className="w-4 h-4" />
                    <span>Select an AI companion for this session...</span>
                  </div>
                )}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0 matrix-card border-primary/20 backdrop-blur-md" align={isMobile ? "center" : "start"} sideOffset={5}>
              <Command className="matrix-card bg-background/50 backdrop-blur-sm">
                <div className="flex items-center border-b border-primary/20 px-3 py-2">
                  {showLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin text-primary" />
                  ) : (
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-primary" />
                  )}
                  <CommandInput 
                    placeholder="Search AI companions..." 
                    value={search}
                    onValueChange={setSearch}
                    className="border-0 bg-transparent p-0 focus:ring-0 focus:outline-none"
                  />
                </div>
                <CommandList className="max-h-60">
                  {showLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6">
                      <div className="relative">
                        <Sparkles className="h-8 w-8 text-primary animate-bounce" />
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-sm font-medium text-foreground animate-pulse">Searching companions...</p>
                        <p className="text-xs text-muted-foreground mt-1">AI is analyzing your query</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <CommandEmpty className="py-8 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="p-3 bg-muted/50 rounded-xl border border-border/50 hover:bg-muted/70 transition-colors duration-300">
                            <Search className="h-8 w-8 text-muted-foreground animate-pulse" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">No companions found</p>
                            <p className="text-xs text-muted-foreground">
                              Try searching for different keywords or create a new companion
                            </p>
                          </div>
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {agents.map((agent) => (
                          <CommandItem
                            key={agent.id}
                            value={`${agent.name} ${agent.id}`}
                            onSelect={() => handleAgentSelect(agent.id)}
                            className="group flex items-center space-x-4 px-4 py-3 mx-2 rounded-lg hover:bg-accent/50 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer border border-transparent hover:border-border/50"
                          >
                            <div className="p-2 bg-muted/50 rounded-lg group-hover:bg-accent group-hover:shadow-sm transition-all duration-200 border border-border/50">
                              <Bot className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
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
                                  {formatCategoryName(agent.category)}
                                </p>
                              </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0 translate-x-2">
                              <div className="text-xs text-primary font-medium">Select →</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground">
            Choose the AI companion that will be used for all conversations in this session
          </p>
        </div>

        {/* Preview Section */}
        {(wizardState.name || selectedAgent || wizardState.description) && (
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-3">Session Preview</h4>
            <div className="space-y-2 text-sm">
              {wizardState.name && (
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-primary" />
                  <span><strong>Name:</strong> {wizardState.name}</span>
                </div>
              )}
              {wizardState.description && (
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <strong>Description:</strong> 
                    <p className="text-xs text-muted-foreground mt-1">{wizardState.description}</p>
                  </div>
                </div>
              )}
              {selectedAgent && (
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span><strong>AI Companion:</strong> {selectedAgent.name}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </WizardLayout>
  );
};