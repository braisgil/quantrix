import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, Plus } from "lucide-react";

interface SessionsEmptyStateProps {
  onCreateSession: () => void;
  hasAgents: boolean;
}

export const SessionsEmptyState = ({ onCreateSession, hasAgents }: SessionsEmptyStateProps) => {
  return (
    <Card className="matrix-card border-primary/20 backdrop-blur-md">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center matrix-border">
            <FolderOpen className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          {hasAgents ? "No Sessions Yet" : "Create an Agent First"}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          {hasAgents 
            ? "Sessions help you organize conversations by topic. Create your first session to start having focused conversations with your AI companions."
            : "Before you can create sessions, you need to have at least one AI agent. Create an agent to get started."
          }
        </p>
        {!hasAgents && (
        <Button 
          onClick={onCreateSession}
        className="matrix-glow bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          {"Create an Agent First"}
        </Button>
        )}
      </CardContent>
    </Card>
  );
};