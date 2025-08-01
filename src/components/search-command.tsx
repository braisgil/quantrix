import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { 
  Search, 
  Users, 
  Code, 
  MessageSquare, 
  Zap,
  Brain,
  Terminal
} from "lucide-react";

import { 
  CommandInput, 
  CommandItem, 
  CommandList,
  CommandGroup,
  CommandEmpty,
  CommandDialog
} from "@/components/ui/command";
import { useTRPC } from "@/trpc/client";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DashboardCommand = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Placeholder data for demonstration - replace with actual TRPC queries
  const mockSessions = [
    { id: "1", name: "Neural Language Training", type: "session" },
    { id: "2", name: "Quantum Consciousness Dialog", type: "session" },
    { id: "3", name: "Matrix Code Analysis", type: "session" },
  ];

  const mockAgents = [
    { id: "1", name: "Neo", type: "agent", avatar: "N" },
    { id: "2", name: "Oracle", type: "agent", avatar: "O" },
    { id: "3", name: "Morpheus", type: "agent", avatar: "M" },
  ];

  const filteredSessions = mockSessions.filter(session =>
    session.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAgents = mockAgents.filter(agent =>
    agent.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CommandDialog 
      open={open} 
      onOpenChange={setOpen}
      className="matrix-card border-primary/30"
    >
      <div className="flex items-center border-b border-primary/20 px-3">
        <Terminal className="mr-2 h-4 w-4 shrink-0 text-primary" />
        <CommandInput
          placeholder="Search neural networks, agents, or sessions..."
          value={search}
          onValueChange={(value) => setSearch(value)}
          className="border-0 focus:ring-0 text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <CommandList className="max-h-[300px]">
        <CommandEmpty className="py-6 text-center text-sm">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <span className="text-muted-foreground">
              No neural networks found
            </span>
            <span className="text-xs text-muted-foreground">
              Try searching for &quot;agent&quot;, &quot;session&quot;, or &quot;neural&quot;
            </span>
          </div>
        </CommandEmpty>
        
        {filteredSessions.length > 0 && (
          <CommandGroup heading="Neural Sessions">
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
        )}

        {filteredAgents.length > 0 && (
          <CommandGroup heading="AI Agents">
            {filteredAgents.map((agent) => (
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
                    {agent.avatar}
                  </div>
                  <span className="text-sm font-medium">{agent.name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {search && filteredSessions.length === 0 && filteredAgents.length === 0 && (
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
              <span className="text-sm font-medium">Create New Session</span>
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
              <span className="text-sm font-medium">Create New Agent</span>
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};
