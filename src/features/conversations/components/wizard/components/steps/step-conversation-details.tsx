import { useState } from "react";
import { MessageSquare, Calendar, Clock, Search, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { format } from "date-fns";
import { WizardLayout } from "../shared/wizard-layout";
import { useSearchAgents } from "@/features/agents/api/use-search-agents";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { useIsMobile } from "@/hooks/use-mobile";
import type { StepProps } from "../../types/wizard";
import { formatCategoryName } from "@/features/agents/utils/category-helpers";

export const StepConversationDetails = ({ wizardState, updateWizardState }: StepProps) => {
  const [isAgentPopoverOpen, setIsAgentPopoverOpen] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [hour, setHour] = useState(wizardState.scheduledTime ? wizardState.scheduledTime.split(':')[0] : '');
  const [minute, setMinute] = useState(wizardState.scheduledTime ? wizardState.scheduledTime.split(':')[1] : '');
  
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

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      updateWizardState({ scheduledDate: date });
      setIsDatePopoverOpen(false);
    }
  };

  const handleTimeChange = (newHour: string, newMinute: string) => {
    setHour(newHour);
    setMinute(newMinute);
    
    if (newHour && newMinute) {
      const timeString = `${newHour.padStart(2, '0')}:${newMinute.padStart(2, '0')}`;
      updateWizardState({ scheduledTime: timeString });
    }
  };

  const selectedAgent = agents.find(agent => agent.id === wizardState.agentId);

  return (
    <WizardLayout
      title="Conversation Details"
      description="Set up your conversation with an AI companion"
      icon={MessageSquare}
    >
      <div className="space-y-6">
        {/* Conversation Name */}
        <div className="space-y-2">
          <Label htmlFor="conversation-name" className="text-sm font-medium text-primary">
            Conversation Name
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10">
              <MessageSquare className="w-4 h-4 text-primary" strokeWidth={2} />
            </div>
            <Input
              id="conversation-name"
              type="text"
              placeholder="Enter conversation name..."
              value={wizardState.name}
              onChange={(e) => updateWizardState({ name: e.target.value })}
              className="pl-10 matrix-border bg-background/50 backdrop-blur-sm"
            />
          </div>
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
                    <User className="w-4 h-4 text-primary" />
                    <span className="truncate">{selectedAgent.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Select an AI companion...</span>
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
                              <User className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
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
        </div>

        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primary">
              Scheduled Date
            </Label>
            <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal matrix-border bg-background/50 backdrop-blur-sm hover:bg-accent/50"
                >
                  <Calendar className="mr-2 h-4 w-4 text-primary" />
                  {wizardState.scheduledDate ? (
                    format(wizardState.scheduledDate, "PPP")
                  ) : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 matrix-card border-primary/20 backdrop-blur-md" align="start">
                <CalendarComponent
                  mode="single"
                  selected={wizardState.scheduledDate || undefined}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="matrix-border bg-background/50 backdrop-blur-sm"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primary">
              Scheduled Time
            </Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10">
                  <Clock className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <Input
                  type="number"
                  placeholder="00"
                  min="0"
                  max="23"
                  value={hour}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 23)) {
                      handleTimeChange(value, minute);
                    }
                  }}
                  className="pl-10 text-center matrix-border bg-background/50 backdrop-blur-sm"
                />
              </div>
              <span className="text-lg font-medium text-primary">:</span>
              <div className="relative flex-1">
                <Input
                  type="number"
                  placeholder="00"
                  min="0"
                  max="59"
                  value={minute}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 59)) {
                      handleTimeChange(hour, value);
                    }
                  }}
                  className="text-center matrix-border bg-background/50 backdrop-blur-sm"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">24-hour format (00:00 - 23:59)</p>
          </div>
        </div>

        {/* Preview Section */}
        {(wizardState.name || selectedAgent || wizardState.scheduledDate) && (
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-3">Conversation Preview</h4>
            <div className="space-y-2 text-sm">
              {wizardState.name && (
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span><strong>Name:</strong> {wizardState.name}</span>
                </div>
              )}
              {selectedAgent && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <span><strong>AI Companion:</strong> {selectedAgent.name}</span>
                </div>
              )}
              {wizardState.scheduledDate && wizardState.scheduledTime && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>
                    <strong>Scheduled:</strong> {format(wizardState.scheduledDate, "PPP")} at {wizardState.scheduledTime}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </WizardLayout>
  );
}; 