'use client';

import { useQueryConversation } from '../api/use-query-conversation';
import { Card, CardContent } from '@/components/ui/card';
import {
  ConversationNavigationHeader,
  ConversationHeader,
  ConversationDetailsCard,
  ConversationSummaryCard,
  ConversationActionButtons
} from '../components';
import { ChatProvider } from '@/features/chat/components/chat-provider';
import { ConversationStatus } from '../types';

interface ConversationDetailViewProps {
  conversationId: string;
}

export const ConversationDetailView = ({ conversationId }: ConversationDetailViewProps) => {
  const { data: conversation } = useQueryConversation(conversationId);

  const handleStartConversation = () => {
    // TODO: Implement conversation start
    console.log('Start conversation:', conversation.name);
  };

  const handleEditConversation = () => {
    // TODO: Implement conversation editing
    console.log('Edit conversation:', conversation.name);
  };

  const handleDeleteConversation = () => {
    // TODO: Implement conversation deletion
    console.log('Delete conversation:', conversation.name);
  };

  const handleViewTranscript = () => {
    if (conversation.transcriptUrl) {
      window.open(conversation.transcriptUrl, '_blank');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Navigation Header */}
      <ConversationNavigationHeader sessionId={conversation.sessionId} />

      {/* Header */}
      <div>
        <ConversationHeader conversation={conversation} />

        <CardContent className="pb-4 sm:pb-6 px-0">
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ConversationDetailsCard conversation={conversation} />
            <div className="flex flex-col gap-6">
              {conversation.status === ConversationStatus.Completed && (
                <ChatProvider channelId={conversation.id} channelName={conversation.name} />
              )}
              <ConversationSummaryCard conversation={conversation} />
            </div>
          </div>

          {/* Action Buttons */}
          <ConversationActionButtons
            conversation={conversation}
            onStartConversation={handleStartConversation}
            onEditConversation={handleEditConversation}
            onViewTranscript={handleViewTranscript}
          />
        </CardContent>
      </div>
    </div>
  );
}; 