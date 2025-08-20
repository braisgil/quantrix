"use client";

import { useRouter } from "next/navigation";
import { useQuerySessions } from "../api/use-query-sessions";
import { useQueryAgents } from "@/features/agents/api/use-query-agents";
import { SessionsListHeader } from "../components/list-view/session-list-header";
import { SessionsList } from "../components/list-view/sessions-list";
import { SessionWizard } from "../components/wizard/components/session-wizard";
import { useCreateSession } from "../api/use-create-session";
import { SessionsEmptyState } from "../components/list-view/sessions-empty-state";
import { useWizardState } from "../hooks/use-wizard-state";
import { SessionItem } from "../types";
import { useDeleteSession } from "../api/use-delete-session";
import { useState } from "react";
import { useUsageLimits } from "@/features/premium/api/use-usage-limits";

export const SessionListView = () => {
  const router = useRouter();
  const { showWizard, openWizard, closeWizard } = useWizardState();
  
  const { data: sessionsData } = useQuerySessions({
  });
  const { data: agentsData } = useQueryAgents();
  const { canCreate } = useUsageLimits();
  
  const sessions = sessionsData?.items || [];
  const agents = agentsData?.items || [];
  const hasAgents = agents.length > 0;
  const hasSessions = sessions.length > 0;

  const deleteSessionMutation = useDeleteSession();
  const [deletingSessionId, setDeletingSessionId] = useState<string | undefined>(undefined);
  const createSessionMutation = useCreateSession();

  const handleCreateSession = () => {
    if (!hasAgents) {
      router.push("/agents");
      return;
    }
    if (!canCreate.sessions) {
      return;
    }
    if (hasAgents) {
      openWizard();
    }
  };

  if (showWizard) {
    return (
      <SessionWizard
        onCancel={closeWizard}
        onSubmit={(data) => {
          createSessionMutation.mutate(data, {
            onSuccess: () => {
              closeWizard();
            },
          });
        }}
        isSubmitting={createSessionMutation.isPending}
      />
    );
  }

  const handleDeleteSession = (session: SessionItem) => {
    setDeletingSessionId(session.id);
    deleteSessionMutation.mutate({ id: session.id }, {
      onSettled: () => setDeletingSessionId(undefined),
    });
  };

  return (
    <div className="space-y-6">
      <SessionsListHeader
        onCreateSession={handleCreateSession}
        hasAgents={hasAgents}
        canCreate={canCreate.sessions}
      />
      {hasSessions ? (
      <SessionsList
        sessions={sessions}
        onDeleteSession={handleDeleteSession}
        deletingSessionId={deletingSessionId}
      />
      ) : (
        <SessionsEmptyState onCreateSession={handleCreateSession} hasAgents={hasAgents} />
      )}
    </div>
  );
};