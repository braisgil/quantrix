import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FolderOpen, Plus, Bot, Calendar, Archive, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import type { SessionGetOne } from "../../types";

interface SessionHeaderProps {
  session: SessionGetOne;
  onCreateConversation: () => void;
}

export const SessionHeader = ({ session, onCreateConversation }: SessionHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.push("/sessions");
  };

  const getStatusIcon = () => {
    switch (session.status) {
      case "archived":
        return <Archive className="w-3 h-3" />;
      case "completed":
        return <CheckCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (session.status) {
      case "archived":
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      default:
        return "bg-primary/10 text-primary border-primary/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Sessions
      </Button>

      {/* Header Card */}
      <Card className="matrix-card border-primary/20 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl matrix-border matrix-glow">
                <FolderOpen className="w-6 h-6 text-primary" />
              </div>
              
              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{session.name}</h1>
                  {session.status !== "active" && (
                    <Badge variant="outline" className={`text-xs ${getStatusColor()}`}>
                      {getStatusIcon()}
                      <span className="ml-1">{session.status}</span>
                    </Badge>
                  )}
                </div>
                
                {session.description && (
                  <p className="text-muted-foreground">{session.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Bot className="w-4 h-4" />
                    <span>{session.agent.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <Button
              onClick={onCreateConversation}
              className="matrix-glow bg-primary hover:bg-primary/90 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Conversation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};