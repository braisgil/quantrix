'use client';

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/confirm-dialog";
import { FolderOpen, MessageSquare, Clock, Bot, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { formatAgentTotalDuration } from "@/features/agents/utils/agent-helpers";
import type { SessionList } from "../../types";
import { SessionStatus } from "../../types";
import Link from "next/link";
import { 
  getSessionStatusIcon, 
  getSessionStatusColor, 
  getSessionStatusLabel,
  formatConversationCount
} from "../../utils";

interface SessionListItemProps {
  session: SessionList[number];
  onConfigure?: (session: SessionList[number]) => void;
  onDelete?: (session: SessionList[number]) => void;
  isDeleting?: boolean;
}

export const SessionListItem = ({ session, onConfigure, onDelete, isDeleting }: SessionListItemProps) => {
  const StatusIcon = getSessionStatusIcon(session.status as SessionStatus);
  const statusColor = getSessionStatusColor(session.status as SessionStatus);
  const statusLabel = getSessionStatusLabel(session.status as SessionStatus);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleConfigure = () => {
    if (isNavigating) return;
    setIsNavigating(true);
  };

  const handleDelete = () => {
    onDelete?.(session);
    setIsDeleteDialogOpen(false);
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
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary/70" />
              <span>{formatAgentTotalDuration(session.totalDuration || 0)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4 sm:mt-0 sm:ml-6">
        <Button
          asChild
          size="sm"
          onClick={handleConfigure}
          variant="view"
          className="font-semibold w-full sm:w-auto"
          disabled={isNavigating}
        >
          <Link href={`/sessions/${session.id}`}>
            {isNavigating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
            <span className="ml-2 sm:hidden">{isNavigating ? 'Loading…' : 'View'}</span>
          </Link>
        </Button>

        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Session"
          description={<span>Are you sure you want to delete “{session.name}”? This action cannot be undone and will also delete all associated conversations.</span>}
          confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          confirmButtonClassName="bg-destructive hover:bg-destructive/90 text-white font-semibold w-full sm:w-auto"
          cancelButtonClassName="w-full sm:w-auto"
        >
          <Button
            size="sm"
            className="bg-destructive hover:bg-destructive/90 text-white font-semibold w-full sm:w-auto"
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
            <span className="ml-2 sm:hidden">{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  );
};