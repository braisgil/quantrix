'use client';

import { useQueryConversations } from '../api/use-query-conversations';
import type { ConversationGetMany } from '../types';
import { calculateConversationStats } from '../utils/conversation-helpers';
import { 
  ConversationsStatsCards, 
  ConversationsList, 
  ConversationsEmptyState, 
  ConversationsListHeader 
} from '../components';
import { useRouter } from 'next/navigation';
import { useDeleteConversation } from '../api/use-delete-conversation';
import { useState } from 'react';

export const ConversationListView = () => {
  const router = useRouter();
  const { data: conversationsData } = useQueryConversations();
  const conversations = conversationsData.items || [];
  const { totalConversations, activeConversations, completedConversations, upcomingConversations } = calculateConversationStats(conversations);
  const deleteConversationMutation = useDeleteConversation();
  const [deletingConversationId, setDeletingConversationId] = useState<string | undefined>(undefined);

  const handleCreateConversation = () => {
    // Redirect to sessions page where conversations are created within session context
    router.push('/sessions');
  };

  const handleViewConversation = (conversation: ConversationGetMany[number]) => {
    router.push(`/conversations/${conversation.id}`);
  };

  const handleDeleteConversation = (conversation: ConversationGetMany[number]) => {
    setDeletingConversationId(conversation.id);
    deleteConversationMutation.mutate({ id: conversation.id }, {
      onSettled: () => setDeletingConversationId(undefined),
    });
  };

  return (
    <div className="space-y-8">
      <ConversationsListHeader onCreateConversation={handleCreateConversation} />
      <div className="space-y-8">
        <ConversationsStatsCards
          totalConversations={totalConversations}
          activeConversations={activeConversations}
          completedConversations={completedConversations}
          upcomingConversations={upcomingConversations}
        />

        {conversations.length > 0 ? (
          <ConversationsList 
            conversations={conversations}
            onViewConversation={handleViewConversation}
            onDeleteConversation={handleDeleteConversation}
            deletingConversationId={deletingConversationId}
          />
        ) : (
          <ConversationsEmptyState />
        )}
      </div>
    </div>
  );
}; 