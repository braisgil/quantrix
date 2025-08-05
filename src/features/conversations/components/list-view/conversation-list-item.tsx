'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, Play, ExternalLink, Calendar, User } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import type { ConversationGetMany } from '../../types';
import { ConversationStatus } from '../../types';
import { 
  getConversationStatusLabel, 
  getConversationStatusColor,
  formatConversationDuration,
  getConversationDescription 
} from '../../utils/conversation-helpers';

interface ConversationListItemProps {
  conversation: ConversationGetMany[number];
  onViewConversation: (conversation: ConversationGetMany[number]) => void;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  onViewConversation,
}) => {
  const statusLabel = getConversationStatusLabel(conversation.status as ConversationStatus);
  const statusColor = getConversationStatusColor(conversation.status as ConversationStatus);
  const description = getConversationDescription(conversation);
  const duration = formatConversationDuration(conversation.startedAt, conversation.endedAt);

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 bg-muted/50 rounded-lg border border-primary/20 hover:matrix-border transition-all duration-300">
      <div className="flex-1 w-full">
        {/* Group 1: Icon, Name, and Badges */}
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="hidden sm:block p-3 bg-primary/10 rounded-lg matrix-glow flex-shrink-0">
            <MessageSquare className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">{conversation.name}</h3>
              <Badge 
                variant="secondary" 
                className={`${statusColor} ${
                  conversation.status === ConversationStatus.Upcoming 
                    ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/40 dark:text-yellow-500 dark:bg-yellow-500/10 dark:border-yellow-500/30' 
                    : 'bg-primary/10 text-primary border-primary/30'
                } text-xs font-medium`}
              >
                {statusLabel}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">
                <User className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">{conversation.agent.name}</span>
                <span className="sm:hidden">{conversation.agent.name.split(' ')[0]}</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Group 2: Description and Stats */}
        <div className="mt-3 sm:mt-4">
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
              {description}
            </p>
          )}
          {/* Enhanced stats - always on same line */}
          <div className="flex items-center gap-2 sm:gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 bg-muted/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border/50">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary/70" />
              <span>{duration}</span>
            </div>
            {conversation.scheduledDateTime && (
              <div className="flex items-center gap-2 bg-muted/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border/50">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-primary/70" />
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
      
      <div className="flex items-center justify-end sm:justify-start space-x-3 mt-3 sm:mt-0 sm:ml-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewConversation(conversation)}
          className="matrix-border hover:matrix-glow w-full sm:w-auto"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="ml-2 sm:hidden">View</span>
        </Button>
        {conversation.status === ConversationStatus.Upcoming && (
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-black font-semibold matrix-glow w-full sm:w-auto"
          >
            <Play className="w-4 h-4" />
            <span className="ml-2 sm:hidden">Start</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConversationListItem; 