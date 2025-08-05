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
import { useWizardState } from '../hooks/use-wizard-state';
import { ConversationWizard } from '../components/wizard';
import { useRouter } from 'next/navigation';

export const ConversationListView = () => {
  const router = useRouter();
  const { showWizard, openWizard, closeWizard } = useWizardState();
  const { data: conversationsData } = useQueryConversations();
  const conversations = conversationsData.items || [];
  const { totalConversations, activeConversations, completedConversations, upcomingConversations } = calculateConversationStats(conversations);

  if (showWizard) {
    return (
      <div className="space-y-0">
        <ConversationWizard 
          onSuccess={closeWizard}
          onCancel={closeWizard}
        />
      </div>
    );
  }

  const handleViewConversation = (conversation: ConversationGetMany[number]) => {
    router.push(`/conversations/${conversation.id}`);
  };

  return (
    <div className="space-y-8">
      <ConversationsListHeader onCreateConversation={openWizard} />
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