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
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Navigation Header */}
      <ConversationNavigationHeader />

      {/* Main Conversation Detail Card */}
      <Card className="w-full mx-auto matrix-card border-primary/20 backdrop-blur-md">
        <ConversationHeader conversation={conversation} />

        <CardContent className="pb-4 sm:pb-6">
          {/* Conversation Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ConversationDetailsCard conversation={conversation} />
            <ConversationSummaryCard conversation={conversation} />
          </div>

          {/* Action Buttons */}
          <ConversationActionButtons
            conversation={conversation}
            onStartConversation={handleStartConversation}
            onEditConversation={handleEditConversation}
            onDeleteConversation={handleDeleteConversation}
            onViewTranscript={handleViewTranscript}
          />
        </CardContent>
      </Card>
    </div>
  );
}; 