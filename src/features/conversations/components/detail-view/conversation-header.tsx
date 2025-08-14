'use client';

import { CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ConversationGetOne } from '../../types';
import { ConversationStatus } from '../../types';
import { 
  getConversationIcon, 
  getConversationStatusLabel,
  getEffectiveDisplayStatus,
  getConversationStatusBadgeClasses,
} from '../../utils/conversation-helpers';
import { MessageSquare } from 'lucide-react';

interface ConversationHeaderProps {
  conversation: ConversationGetOne;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({ conversation }) => {
  const effectiveStatus = getEffectiveDisplayStatus(conversation);
  const StatusIcon = getConversationIcon(effectiveStatus as ConversationStatus);
  const statusLabel = getConversationStatusLabel(effectiveStatus as ConversationStatus);
  const statusBadgeClasses = getConversationStatusBadgeClasses(effectiveStatus as ConversationStatus);

  return (
    <CardHeader className="text-center pb-0 mb-6 sm:pb-0">
      {/* Header with Icon and Title */}
      <div className="flex items-center justify-center gap-3 mb-0">
        <div className="relative matrix-glow">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center matrix-border">
          <MessageSquare className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold quantrix-gradient matrix-text-glow">
          {conversation.name}
        </h1>
      </div>

      {/* Status Badge only to avoid repeating details shown below */}
      <div className="flex flex-wrap gap-2 justify-center mb-2">
        <Badge variant="secondary" className={`matrix-border matrix-glow ${statusBadgeClasses}`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusLabel}
        </Badge>
      </div>
    </CardHeader>
  );
};