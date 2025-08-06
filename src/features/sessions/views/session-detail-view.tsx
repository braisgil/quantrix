'use client';

import { useQuerySession } from '../api/use-query-session';
import { useQuerySessionConversations } from '../api/use-query-session-conversations';
import { Card, CardContent } from '@/components/ui/card';
import { SessionNavigationHeader } from '../components/shared/session-navigation-header';
import { 
  SessionHeader,
  SessionDetailsCard,
  SessionConversationsCard,
  SessionChatCard,
  SessionActionButtons
} from '../components/detail-view';
import { ConversationWizard } from "@/features/conversations/components/wizard/components/conversation-wizard";
import { useWizardState } from "../hooks/use-wizard-state";

interface SessionDetailViewProps {
  sessionId: string;
}

export const SessionDetailView = ({ sessionId }: SessionDetailViewProps) => {
  const { showWizard, openWizard, closeWizard } = useWizardState();
  const { data: session } = useQuerySession(sessionId);
  const { data: conversationsData } = useQuerySessionConversations({
    sessionId,
  });
  
  const conversations = conversationsData?.items || [];

  const handleCreateConversation = () => {
    openWizard();
  };

  const handleStartChat = () => {
    // TODO: Implement chat functionality
    console.log('Start chat for session:', sessionId);
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
    <div className="w-full max-w-5xl mx-auto space-y-6">
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
          <div className="grid grid-cols-1 gap-6 mb-8">

              <SessionConversationsCard
                conversations={conversations}
                onCreateConversation={handleCreateConversation}
              />
              <SessionChatCard
                sessionId={sessionId}
                onStartChat={handleStartChat}
              />
          </div>

          {/* Action Buttons */}
          <SessionActionButtons
            onCreateConversation={handleCreateConversation}
            onStartChat={handleStartChat}
          />
        </CardContent>
      </div>
    </div>
  );
};