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
    <Card className="matrix-card">
      <CardHeader>
        <CardTitle className="text-xl">Conversation List</CardTitle>
        <CardDescription>
          View your conversations with AI companions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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