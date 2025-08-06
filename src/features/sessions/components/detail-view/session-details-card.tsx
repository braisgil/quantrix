import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Bot, Calendar, MessageSquare, Archive, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import type { SessionGetOne } from "../../types";

interface SessionDetailsCardProps {
  session: SessionGetOne;
}

export const SessionDetailsCard = ({ session }: SessionDetailsCardProps) => {
  const getStatusIcon = () => {
    switch (session.status) {
      case "archived":
        return <Archive className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
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
    <Card className="matrix-card border-primary/20 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Info className="w-4 h-4 text-primary" />
          Session Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Status</p>
          <Badge variant="outline" className={getStatusColor()}>
            {getStatusIcon()}
            <span className={getStatusIcon() ? "ml-1" : ""}>
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </span>
          </Badge>
        </div>

        {/* AI Companion */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">AI Companion</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-black" />
            </div>
            <div>
              <p className="text-sm font-medium">{session.agent.name}</p>
              <p className="text-xs text-muted-foreground">{session.agent.category}</p>
            </div>
          </div>
        </div>

        {/* Conversations Count */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Conversations</p>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="text-sm">
              {session.conversationCount || 0} {session.conversationCount === 1 ? "conversation" : "conversations"}
            </span>
          </div>
        </div>

        {/* Created Date */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Created</p>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm">
              {format(new Date(session.createdAt), "PPP")}
            </span>
          </div>
        </div>

        {/* Description */}
        {session.description && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Description</p>
            <p className="text-sm text-muted-foreground">
              {session.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};