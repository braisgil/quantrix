'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderOpen, MessageSquare, Calendar, Bot, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { SessionGetMany } from "../../types";
import { SessionStatus } from "../../types";
import { 
  getSessionStatusIcon, 
  getSessionStatusColor, 
  getSessionStatusLabel,
  formatConversationCount
} from "../../utils";

interface SessionListItemProps {
  session: SessionGetMany[0];
  onConfigure?: (session: SessionGetMany[0]) => void;
}

export const SessionListItem = ({ session, onConfigure }: SessionListItemProps) => {
  const StatusIcon = getSessionStatusIcon(session.status as SessionStatus);
  const statusColor = getSessionStatusColor(session.status as SessionStatus);
  const statusLabel = getSessionStatusLabel(session.status as SessionStatus);

  const handleConfigure = () => {
    onConfigure?.(session);
  };

  return (
    <div className="matrix-card flex flex-col sm:flex-row sm:items-start sm:justify-between p-5 bg-muted/50 rounded-lg border border-primary/20 hover:matrix-border transition-all duration-300">
      <div className="flex-1 w-full">
        {/* Group 1: Icon, Name, and Badges */}
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="hidden sm:block p-3 bg-primary/10 rounded-lg matrix-glow flex-shrink-0">
            <FolderOpen className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1">{session.name}</h3>
              {session.status !== SessionStatus.Active && (
                <Badge 
                  variant="secondary" 
                  className={`${statusColor} text-xs font-medium`}
                >
                  {StatusIcon && <StatusIcon className="w-3 h-3" />}
                  <span className="ml-1">{statusLabel}</span>
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bot className="h-4 w-4 text-primary/70" />
              <span>{session.agent.name}</span>
            </div>
          </div>
        </div>

        {/* Group 2: Description and Stats */}
        <div className="mt-3 sm:mt-4">
          {session.description && (
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
              {session.description}
            </p>
          )}
          {/* Enhanced stats - always on same line */}
          <div className="flex items-center gap-2 sm:gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 bg-muted/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border/50">
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-primary/70" />
              <span>{formatConversationCount(session.conversationCount || 0)}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border/50">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-primary/70" />
              <span>
                {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end sm:justify-start space-x-3 mt-4 sm:mt-0 sm:ml-6">
          <Button
            variant="outline"
            size="sm"
            className="matrix-border hover:matrix-glow w-full sm:w-auto"
            onClick={handleConfigure}
          >
            <ExternalLink className="w-4 h-4" />
            <span className="ml-2 sm:hidden">View</span>
          </Button>
      </div>
    </div>
  );
};