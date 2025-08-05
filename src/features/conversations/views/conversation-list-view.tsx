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

export const ConversationListView = () => {
  const router = useRouter();
  const { data: conversationsData } = useQueryConversations();
  const conversations = conversationsData.items || [];
  const { totalConversations, activeConversations, completedConversations, upcomingConversations } = calculateConversationStats(conversations);

  const handleCreateConversation = () => {
    // TODO: Implement conversation creation
    console.log('Create conversation');
  };

  const handleViewConversation = (conversation: ConversationGetMany[number]) => {
    router.push(`/conversations/${conversation.id}`);
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
          />
        ) : (
          <ConversationsEmptyState />
        )}
      </div>
    </div>
  );
}; 