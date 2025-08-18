'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/confirm-dialog';
import { Clock, ExternalLink, Calendar, Bot, Trash2, PhoneCall, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import type { ConversationList } from '../../types';
import { ConversationStatus } from '../../types';
import { 
  getConversationStatusLabel, 
  formatConversationDuration,
  isConversationJoinAvailable,
  getConversationIcon,
  getEffectiveDisplayStatus,
  getConversationStatusBadgeClasses,
} from '../../utils/conversation-helpers';

interface ConversationListItemProps {
  conversation: ConversationList[number];
  onViewConversation: (conversation: ConversationList[number]) => void;
  onDelete?: (conversation: ConversationList[number]) => void;
  isDeleting?: boolean;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  onViewConversation,
  onDelete,
  isDeleting,
}) => {
  const effectiveStatus = getEffectiveDisplayStatus(conversation);
  const statusLabel = getConversationStatusLabel(effectiveStatus as ConversationStatus);
  const statusBadgeClasses = getConversationStatusBadgeClasses(effectiveStatus as ConversationStatus);
  const duration = formatConversationDuration(conversation.startedAt, conversation.endedAt);
  const StatusIcon = getConversationIcon(conversation.status as ConversationStatus);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewNavigating, setIsViewNavigating] = useState(false);
  const [isCallNavigating, setIsCallNavigating] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    onDelete?.(conversation);
    setIsDeleteDialogOpen(false);
  };

  const canDelete = conversation.status !== ConversationStatus.Completed;

  return (
    <div className="matrix-card flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 sm:p-5 bg-muted/50 rounded-lg border border-primary/20 hover:matrix-border transition-all duration-300">
      <div className="flex-1 w-full">
        {/* Group 1: Icon, Name, and Badges */}
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-primary/10 rounded-lg matrix-glow flex-shrink-0">
            <StatusIcon className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-foreground text-base sm:text-lg mb-0">{conversation.name}</h3>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={`matrix-border ${statusBadgeClasses} text-xs font-medium`}
                >
                  {statusLabel}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bot className="h-4 w-4 text-primary/70" />
              <span>{conversation.agent.name}</span>
            </div>
          </div>
        </div>

        {/* Group 2: Stats */}
        <div className="mt-3 sm:mt-4">
          {/* Enhanced stats - responsive layout */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg border border-border/50">
              <Clock className="w-4 h-4 text-primary/70" />
              <span>{duration}</span>
            </div>
            {conversation.scheduledDateTime && (
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg border border-border/50">
                <Calendar className="w-4 h-4 text-primary/70" />
                <span className="hidden sm:inline">
                  {format(new Date(conversation.scheduledDateTime), 'MMM d, yyyy h:mm a')}
                </span>
                <span className="sm:hidden">
                  {format(new Date(conversation.scheduledDateTime), 'MMM d, h:mm a')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4 sm:mt-0 sm:ml-6">
        <Button
          asChild
          size="sm"
          onClick={() => {
            if (isViewNavigating) return;
            setIsViewNavigating(true);
          }}
          variant="view"
          className="font-semibold w-full sm:w-auto"
          disabled={isViewNavigating}
        >
          <Link href={`/conversations/${conversation.id}`}>
            {isViewNavigating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
            <span className="ml-2 sm:hidden">{isViewNavigating ? 'Loading…' : 'View'}</span>
          </Link>
        </Button>
        
        {(conversation.status === ConversationStatus.Available || (conversation.status === ConversationStatus.Scheduled && isConversationJoinAvailable(conversation))) && (
          <Button
            asChild
            size="sm"
            variant="call"
            className="font-semibold w-full sm:w-auto"
            disabled={isCallNavigating}
            onClick={(e) => {
              if (isCallNavigating) return;
              setIsCallNavigating(true);
            }}
          >
            <Link href={`/call/${conversation.id}`}>
              {isCallNavigating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PhoneCall className="w-4 h-4" />
              )}
              <span className="ml-2 sm:hidden">{isCallNavigating ? 'Opening…' : 'Start'}</span>
            </Link>
          </Button>
        )}

        {canDelete && (
          <ConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            title="Delete Conversation"
            description={<span>Are you sure you want to delete &ldquo;{conversation.name}&rdquo;? This action cannot be undone.</span>}
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
        )}
      </div>
    </div>
  );
};

export { ConversationListItem }; 