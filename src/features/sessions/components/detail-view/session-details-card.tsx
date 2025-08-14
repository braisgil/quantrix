import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Bot, Calendar, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";
import type { SessionGetOne } from "../../types";
import { SessionStatus } from "../../types";
import { 
  getSessionStatusIcon, 
  getSessionStatusColor, 
  getSessionStatusLabel
} from "../../utils";
import { formatAgentTotalDuration } from "@/features/agents/utils/agent-helpers";

interface SessionDetailsCardProps {
  session: SessionGetOne;
}

export const SessionDetailsCard = ({ session }: SessionDetailsCardProps) => {
  const StatusIcon = getSessionStatusIcon(session.status as SessionStatus);
  const statusColor = getSessionStatusColor(session.status as SessionStatus);
  const statusLabel = getSessionStatusLabel(session.status as SessionStatus);

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
          <Badge variant="outline" className={statusColor}>
            {StatusIcon && <StatusIcon className="w-4 h-4" />}
            <span className={StatusIcon ? "ml-1" : ""}>
              {statusLabel}
            </span>
          </Badge>
        </div>

        {/* AI Companion */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">AI Companion</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
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

        {/* Total Duration */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Total Duration</p>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm">
              {formatAgentTotalDuration(session.totalDuration || 0)}
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