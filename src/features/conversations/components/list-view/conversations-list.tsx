'use client';

import React from 'react';
import type { ConversationGetMany } from '../../types';
import ConversationListItem from './conversation-list-item';

interface ConversationsListProps {
  conversations: ConversationGetMany;
  onViewConversation: (conversation: ConversationGetMany[number]) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  onViewConversation,
}) => {
  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <ConversationListItem
          key={conversation.id}
          conversation={conversation}
          onViewConversation={onViewConversation}
        />
      ))}
    </div>
  );
};

export default ConversationsList; 