'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, Play, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ConversationGetMany } from '../../types';
import { ConversationStatus } from '../../types';
import { 
  getConversationIcon, 
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
  const statusIcon = getConversationIcon(conversation.status as ConversationStatus);
  const statusLabel = getConversationStatusLabel(conversation.status as ConversationStatus);
  const statusColor = getConversationStatusColor(conversation.status as ConversationStatus);
  const description = getConversationDescription(conversation);
  const duration = formatConversationDuration(conversation.startedAt, conversation.endedAt);

  return (
    <Card className="matrix-card border-primary/20 backdrop-blur-md hover:border-primary/40 transition-all duration-200 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Icon */}
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center matrix-glow">
              <span className="text-2xl">{statusIcon}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {conversation.name}
                </h3>
                <Badge 
                  variant="secondary" 
                  className={`${statusColor} bg-primary/10 border-primary/20`}
                >
                  {statusLabel}
                </Badge>
              </div>

              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {description}
              </p>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{conversation.agent.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>Created {formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewConversation(conversation)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View
            </Button>
            {conversation.status === ConversationStatus.Upcoming && (
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-black font-semibold matrix-glow"
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationListItem; 