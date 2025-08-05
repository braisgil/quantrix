'use client';

import { CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import type { ConversationGetOne } from '../../types';
import { ConversationStatus } from '../../types';
import { 
  getConversationIcon, 
  getConversationStatusLabel, 
  getConversationStatusColor 
} from '../../utils/conversation-helpers';

interface ConversationHeaderProps {
  conversation: ConversationGetOne;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({ conversation }) => {
  const statusIcon = getConversationIcon(conversation.status as ConversationStatus);
  const statusLabel = getConversationStatusLabel(conversation.status as ConversationStatus);
  const statusColor = getConversationStatusColor(conversation.status as ConversationStatus);

  return (
    <CardHeader className="pb-4 sm:pb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center matrix-glow">
            <span className="text-3xl">{statusIcon}</span>
          </div>

          {/* Title and Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold quantrix-gradient matrix-text-glow truncate">
                {conversation.name}
              </h1>
              <Badge 
                variant="secondary" 
                className={`${statusColor} bg-primary/10 border-primary/20`}
              >
                {statusLabel}
              </Badge>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Agent: {conversation.agent.name}</span>
              <span>Created {formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}</span>
              {conversation.updatedAt !== conversation.createdAt && (
                <span>Updated {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </CardHeader>
  );
}; 