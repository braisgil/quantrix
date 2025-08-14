'use client';

import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, MessageSquare, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ConversationDetail } from '../../types';
import { 
  formatConversationDuration, 
  isConversationJoinAvailable,
  getConversationStatusLabel,
  getConversationStatusBadgeClasses,
  getConversationIcon,
  getEffectiveDisplayStatus,
} from '../../utils/conversation-helpers';

interface ConversationDetailsCardProps {
  conversation: ConversationDetail;
}

export const ConversationDetailsCard: React.FC<ConversationDetailsCardProps> = ({ conversation }) => {
  const duration = formatConversationDuration(conversation.startedAt, conversation.endedAt);
  const effectiveStatus = getEffectiveDisplayStatus(conversation);
  const StatusIcon = getConversationIcon(effectiveStatus);
  const statusLabel = getConversationStatusLabel(effectiveStatus);
  const statusBadgeClasses = getConversationStatusBadgeClasses(effectiveStatus);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <MessageSquare className="w-4 h-4 text-primary" />
        <h4 className="text-lg font-bold quantrix-gradient matrix-text-glow">Conversation Details</h4>
      </div>
      <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
        <div className="space-y-3 text-sm">
          {/* Status with badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>Status</span>
            </div>
            <Badge variant="secondary" className={`matrix-border ${statusBadgeClasses}`}>
              {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
              {statusLabel}
            </Badge>
          </div>

          {/* Scheduled time (if any) */}
          {conversation.scheduledDateTime && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Scheduled</span>
              </div>
              <span className="text-foreground font-medium">
                {new Date(conversation.scheduledDateTime).toLocaleString()}
              </span>
            </div>
          )}

          {/* Joinable */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Joinable</span>
            </div>
            <span className="text-primary font-medium">
              {isConversationJoinAvailable(conversation) ? 'Yes' : 'No'}
            </span>
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Duration</span>
            </div>
            <span className="text-foreground font-medium">{duration}</span>
          </div>

          {/* Started */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Started</span>
            </div>
            <span className="text-foreground font-medium">
              {conversation.startedAt
                ? formatDistanceToNow(new Date(conversation.startedAt), { addSuffix: true })
                : 'Not started'}
            </span>
          </div>

          {/* Agent */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Agent</span>
            </div>
            <span className="text-primary font-medium">{conversation.agent.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};