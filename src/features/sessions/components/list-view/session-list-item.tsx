'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderOpen, MessageSquare, Calendar, Bot, Archive, CheckCircle, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import type { SessionGetMany } from "../../types";

interface SessionListItemProps {
  session: SessionGetMany[0];
}

export const SessionListItem = ({ session }: SessionListItemProps) => {
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
        return "bg-gray-500/10 text-gray-700 border-gray-500/40 dark:text-gray-500 dark:bg-gray-500/10 dark:border-gray-500/30";
      case "completed":
        return "bg-green-500/10 text-green-700 border-green-500/40 dark:text-green-500 dark:bg-green-500/10 dark:border-green-500/30";
      default:
        return "bg-primary/10 text-primary border-primary/30";
    }
  };

  const getStatusLabel = () => {
    switch (session.status) {
      case "archived":
        return "Archived";
      case "completed":
        return "Completed";
      default:
        return "Active";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 bg-muted/50 rounded-lg border border-primary/20 hover:matrix-border transition-all duration-300">
      <div className="flex-1 w-full">
        {/* Group 1: Icon, Name, and Badges */}
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="hidden sm:block p-3 bg-primary/10 rounded-lg matrix-glow flex-shrink-0">
            <FolderOpen className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">{session.name}</h3>
              {session.status !== "active" && (
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor()} text-xs font-medium`}
                >
                  {getStatusIcon()}
                  <span className="ml-1">{getStatusLabel()}</span>
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
              <span>{session.conversationCount || 0} conversation{(session.conversationCount || 0) !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border/50">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-primary/70" />
              <span className="hidden sm:inline">
                {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
              </span>
              <span className="sm:hidden">
                {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end sm:justify-start space-x-3 mt-3 sm:mt-0 sm:ml-4">
        <Link href={`/sessions/${session.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="matrix-border hover:matrix-glow w-full sm:w-auto"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="ml-2 sm:hidden">View</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};