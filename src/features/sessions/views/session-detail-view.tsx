"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuerySession } from "../api/use-query-session";
import { useQuerySessionConversations } from "../api/use-query-session-conversations";
import { SessionHeader } from "../components/detail-view/session-header";
import { SessionDetailsCard } from "../components/detail-view/session-details-card";
import { SessionConversationsCard } from "../components/detail-view/session-conversations-card";
import { ConversationWizard } from "@/features/conversations/components/wizard/components/conversation-wizard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SessionDetailViewProps {
  sessionId: string;
}

export const SessionDetailView = ({ sessionId }: SessionDetailViewProps) => {
  const router = useRouter();
  const [showConversationWizard, setShowConversationWizard] = useState(false);
  
  const { data: session, isLoading: isLoadingSession, error: sessionError } = useQuerySession(sessionId);
  const { data: conversationsData, isLoading: isLoadingConversations } = useQuerySessionConversations({
    sessionId,
  });
  
  const conversations = conversationsData?.items || [];

  const handleCreateConversation = () => {
    setShowConversationWizard(true);
  };

  const handleWizardSuccess = () => {
    setShowConversationWizard(false);
  };

  const handleWizardCancel = () => {
    setShowConversationWizard(false);
  };

  const handleBack = () => {
    router.push("/sessions");
  };

  if (showConversationWizard && session) {
    return (
      <ConversationWizard
        sessionId={sessionId}
        sessionName={session.name}
        agentId={session.agentId}
        onSuccess={handleWizardSuccess}
        onCancel={handleWizardCancel}
      />
    );
  }

  if (sessionError) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sessions
        </Button>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load session. The session may not exist or you may not have permission to view it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoadingSession || isLoadingConversations) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <Card className="matrix-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
              <Skeleton className="w-32 h-10" />
            </div>
          </CardContent>
        </Card>

        {/* Details Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="matrix-card border-primary/20">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="matrix-card border-primary/20 lg:col-span-2">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      <SessionHeader 
        session={session} 
        onCreateConversation={handleCreateConversation}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SessionDetailsCard session={session} />
        <div className="lg:col-span-2">
          <SessionConversationsCard
            conversations={conversations}
            onCreateConversation={handleCreateConversation}
          />
        </div>
      </div>
    </div>
  );
};