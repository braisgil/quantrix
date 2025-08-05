'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, MessageSquare, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ConversationGetOne } from '../../types';
import { formatConversationDuration } from '../../utils/conversation-helpers';

interface ConversationDetailsCardProps {
  conversation: ConversationGetOne;
}

export const ConversationDetailsCard: React.FC<ConversationDetailsCardProps> = ({ conversation }) => {
  const duration = formatConversationDuration(conversation.startedAt, conversation.endedAt);

  const details = [
    {
      label: 'Status',
      value: conversation.status,
      icon: MessageSquare,
    },
    {
      label: 'Duration',
      value: duration,
      icon: Clock,
    },
    {
      label: 'Started',
      value: conversation.startedAt 
        ? formatDistanceToNow(new Date(conversation.startedAt), { addSuffix: true })
        : 'Not started',
      icon: Calendar,
    },
    {
      label: 'Agent',
      value: conversation.agent.name,
      icon: User,
    },
  ];

  return (
    <Card className="matrix-card border-primary/20 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold matrix-text-glow">
          Conversation Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {details.map((detail) => {
          const Icon = detail.icon;
          return (
            <div key={detail.label} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{detail.label}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{detail.value}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}; 