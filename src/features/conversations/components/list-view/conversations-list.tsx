'use client';

import React from 'react';
import type { ConversationGetMany } from '../../types';
import ConversationListItem from './conversation-list-item';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface ConversationsListProps {
  conversations: ConversationGetMany;
  onViewConversation: (conversation: ConversationGetMany[number]) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  onViewConversation,
}) => {
  return (
    <Card className="matrix-card h-[calc(100vh-12rem)] sm:h-[70vh] min-h-[420px] flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle className="text-xl">Conversation List</CardTitle>
        <CardDescription>
          View your conversations with AI companions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-y-auto space-y-4">
        {conversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            onViewConversation={onViewConversation}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default ConversationsList; 