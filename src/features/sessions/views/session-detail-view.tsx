'use client';

import { useQuerySession } from '../api/use-query-session';
import { useQuerySessionConversations } from '../api/use-query-session-conversations';
import { CardContent } from '@/components/ui/card';
import { SessionNavigationHeader } from '../components/shared/session-navigation-header';
import { 
  SessionHeader,
  SessionConversationsList,
  SessionChatCard
} from '../components/detail-view';
import { ConversationWizard } from "@/features/conversations/components/wizard/components/conversation-wizard";
import { useCreateConversation } from "@/features/conversations/api/use-create-conversation";
import { useWizardState } from "../hooks/use-wizard-state";
import { useDeleteConversation } from "@/features/conversations/api/use-delete-conversation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDeleteSession } from "../api/use-delete-session";
import { ConversationStatus } from "@/features/conversations/types";
import { useUsageLimits } from "@/features/premium/api/use-usage-limits";

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
  const { canCreate } = useUsageLimits();
  
  const conversations = conversationsData?.items || [];
  const hasCompletedConversation = conversations.some(
    (c) => c.status === ConversationStatus.Completed
  );

  const deleteConversationMutation = useDeleteConversation({ sessionId });
  const [deletingConversationId, setDeletingConversationId] = useState<string | undefined>(undefined);
  const deleteSessionMutation = useDeleteSession();
  const createConversationMutation = useCreateConversation({ sessionId });

  const handleCreateConversation = () => {
    if (!canCreate.conversations) return;
    openWizard();
  };

  const handleStartChat = () => {
    // TODO: Implement chat functionality
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
        onCancel={closeWizard}
        onSubmit={(data) => {
          createConversationMutation.mutate(data, {
            onSuccess: () => {
              closeWizard();
            },
          });
        }}
        isSubmitting={createConversationMutation.isPending}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Navigation Header */}
      <SessionNavigationHeader 
        sessionName={session?.name}
        onDelete={handleDeleteSession}
        isDeleting={deleteSessionMutation.isPending}
      />

      {/* Main Session Detail Card */}
      <div className="px-0">
        <SessionHeader session={session} canCreate={canCreate.conversations}/>

        <CardContent className="pb-4 sm:pb-6 px-0">
          {/* 
          Session Information Grid
          <SessionDetailsCard session={session} />
          */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

              <SessionConversationsList
                conversations={conversations}
                onCreateConversation={handleCreateConversation}
                onDeleteConversation={handleDeleteConversation}
                deletingConversationId={deletingConversationId}
                canCreateConversation={canCreate.conversations}
                onViewConversation={(conversation) => {
                  router.push(`/conversations/${conversation.id}`);
                }}
              />
              {session && (
                <SessionChatCard
                  sessionId={session.id}
                  sessionName={session.name}
                  onStartChat={handleStartChat}
                  disabled={!hasCompletedConversation}
                  disabledMessage={
                    !hasCompletedConversation
                      ? "To start a chat in this session, first complete at least one conversation."
                      : undefined
                  }
                />
              )}
          </div>

          {/* Action Buttons moved to navigation header */}
        </CardContent>
      </div>
    </div>
  );
};