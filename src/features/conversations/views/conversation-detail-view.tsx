'use client';

import { useQueryConversation } from '../api/use-query-conversation';
import { CardContent } from '@/components/ui/card';
import {
  ConversationNavigationHeader,
  ConversationHeader,
  ConversationDetailsCard,
  ConversationSummaryCard
} from '../components';
import { ChatProvider } from '@/features/chat/components/chat-provider';
import { ConversationStatus } from '../types';
import { useDeleteConversation } from '../api/use-delete-conversation';
import { useRouter } from 'next/navigation';

interface ConversationDetailViewProps {
  conversationId: string;
}

export const ConversationDetailView = ({ conversationId }: ConversationDetailViewProps) => {
  const { data: conversation } = useQueryConversation(conversationId);
  const router = useRouter();
  const deleteConversationMutation = useDeleteConversation({ sessionId: conversation?.sessionId });

  // Removed start/edit actions; delete handled via header

  const handleDeleteConversation = () => {
    if (!conversation) return;
    deleteConversationMutation.mutate(
      { id: conversation.id },
      {
        onSuccess: () => {
          // Redirect to the specific session detail view that contained this conversation
          router.push(`/sessions/${conversation.sessionId}`);
        },
      }
    );
  };

  // View transcript removed from action buttons; keep feature elsewhere if needed

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Navigation Header */}
      <ConversationNavigationHeader 
        sessionId={conversation.sessionId}
        conversationName={conversation?.name}
        onDelete={conversation.status !== ConversationStatus.Completed ? handleDeleteConversation : undefined}
        isDeleting={deleteConversationMutation.isPending}
      />

      {/* Header */}
      <div>
        <ConversationHeader conversation={conversation} />

        <CardContent className="pb-4 sm:pb-6 px-0">
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ConversationDetailsCard conversation={conversation} />
            <div className="flex flex-col gap-6">
              <ChatProvider
                channelId={conversation.id}
                channelName={conversation.name}
                disabled={conversation.status !== ConversationStatus.Completed}
                disabledMessage={
                  conversation.status !== ConversationStatus.Completed
                    ? "Chat is disabled until this conversation is marked as Completed."
                    : undefined
                }
              />
              <ConversationSummaryCard conversation={conversation} />
            </div>
          </div>

          {/* Action Buttons moved to navigation header */}
        </CardContent>
      </div>
    </div>
  );
}; 