'use client';

import { useQuerySession } from '../api/use-query-session';
import { useQuerySessionConversations } from '../api/use-query-session-conversations';
import { CardContent } from '@/components/ui/card';
import { SessionNavigationHeader } from '../components/shared/session-navigation-header';
import { 
  SessionHeader,
  SessionConversationsCard,
  SessionChatCard,
  SessionActionButtons
} from '../components/detail-view';
import { ConversationWizard } from "@/features/conversations/components/wizard/components/conversation-wizard";
import { useWizardState } from "../hooks/use-wizard-state";
import { useDeleteConversation } from "@/features/conversations/api/use-delete-conversation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDeleteSession } from "../api/use-delete-session";

interface SessionDetailViewProps {
  sessionId: string;
}

export const SessionDetailView = ({ sessionId }: SessionDetailViewProps) => {
  const router = useRouter();
  const { showWizard, openWizard, closeWizard } = useWizardState();
  const { data: session } = useQuerySession(sessionId);
  const { data: conversationsData } = useQuerySessionConversations({
    sessionId,
  });
  
  const conversations = conversationsData?.items || [];
  const deleteConversationMutation = useDeleteConversation({ sessionId });
  const [deletingConversationId, setDeletingConversationId] = useState<string | undefined>(undefined);
  const deleteSessionMutation = useDeleteSession();

  const handleCreateConversation = () => {
    openWizard();
  };

  const handleStartChat = () => {
    // TODO: Implement chat functionality
    console.log('Start chat for session:', sessionId);
  };
  const handleEditSession = () => {
    // TODO: Implement session editing UI
    console.log('Edit session:', sessionId);
  };

  const handleDeleteSession = () => {
    if (!session) return;
    deleteSessionMutation.mutate(
      { id: session.id },
      {
        onSuccess: () => {
          router.push('/sessions');
        },
      }
    );
  };

  const handleDeleteConversation = (conversation: (typeof conversations)[number]) => {
    setDeletingConversationId(conversation.id);
    deleteConversationMutation.mutate({ id: conversation.id }, {
      onSettled: () => setDeletingConversationId(undefined),
    });
  };

  if (showWizard && session) {
    return (
      <ConversationWizard
        sessionId={sessionId}
        sessionName={session.name}
        agentId={session.agentId}
        onSuccess={closeWizard}
        onCancel={closeWizard}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Navigation Header */}
      <SessionNavigationHeader />

      {/* Main Session Detail Card */}
      <div className="px-0">
        <SessionHeader session={session} />

        <CardContent className="pb-4 sm:pb-6 px-0">
          {/* 
          Session Information Grid
          <SessionDetailsCard session={session} />
          */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

              <SessionConversationsCard
                conversations={conversations}
                onCreateConversation={handleCreateConversation}
                onDeleteConversation={handleDeleteConversation}
                deletingConversationId={deletingConversationId}
                onViewConversation={(conversation) => {
                  router.push(`/conversations/${conversation.id}`);
                }}
              />
              {session && (
                <SessionChatCard
                  sessionId={session.id}
                  sessionName={session.name}
                  onStartChat={handleStartChat}
                />
              )}
          </div>

          {/* Action Buttons */}
          <SessionActionButtons
            sessionName={session?.name ?? ''}
            onEditSession={handleEditSession}
            onDeleteSession={handleDeleteSession}
            isDeleting={deleteSessionMutation.isPending}
          />
        </CardContent>
      </div>
    </div>
  );
};