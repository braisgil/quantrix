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
import { Clock, Calendar, FolderOpen } from 'lucide-react';
import { isConversationJoinAvailable, formatConversationDuration } from '../utils/conversation-helpers';
import { format } from 'date-fns';

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
          {/* Quick Usage Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary" />
                <div className="text-sm">
                  <div className="text-muted-foreground">Availability</div>
                  <div className="text-lg font-semibold text-primary">
                    {(() => {
                      if (isConversationJoinAvailable(conversation)) return 'Available';
                      if (conversation.scheduledDateTime) {
                        try {
                          return format(new Date(conversation.scheduledDateTime), 'MMM d, yyyy h:mm a');
                        } catch {
                          return new Date(conversation.scheduledDateTime).toLocaleString();
                        }
                      }
                      return conversation.status;
                    })()}
                  </div>
                </div>
              </div>
            </div>
            <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <div className="text-sm">
                  <div className="text-muted-foreground">Duration</div>
                  <div className="text-lg font-semibold text-primary">
                    {formatConversationDuration(conversation.startedAt, conversation.endedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col gap-6">
              <ConversationDetailsCard conversation={conversation} />
              <ConversationSummaryCard conversation={conversation} />
            </div>
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
            </div>
          </div>

          {/* Related Session */}
          {conversation.session && (
            <div className="mt-2">
              <div className="flex items-center gap-3 mb-3">
                <FolderOpen className="w-4 h-4 text-primary" />
                <h4 className="text-lg font-bold quantrix-gradient matrix-text-glow">Related Session</h4>
              </div>
              <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <div className="text-muted-foreground">Session</div>
                    <div className="text-base font-semibold text-foreground">{conversation.session.name}</div>
                  </div>
                  {/* Navigation back is already in the header; this is informational */}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons moved to navigation header */}
        </CardContent>
      </div>
    </div>
  );
}; 