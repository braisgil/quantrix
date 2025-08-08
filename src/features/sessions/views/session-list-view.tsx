"use client";

import { useRouter } from "next/navigation";
import { useQuerySessions } from "../api/use-query-sessions";
import { useQueryAgents } from "@/features/agents/api/use-query-agents";
import { SessionsListHeader } from "../components/list-view/session-list-header";
import { SessionsList } from "../components/list-view/sessions-list";
import { SessionWizard } from "../components/wizard/components/session-wizard";
import { SessionsEmptyState } from "../components/list-view/sessions-empty-state";
import { useWizardState } from "../hooks/use-wizard-state";
import { SessionGetMany } from "../types";

export const SessionListView = () => {
  const router = useRouter();
  const { showWizard, openWizard, closeWizard } = useWizardState();
  
  const { data: sessionsData } = useQuerySessions({
  });
  const { data: agentsData } = useQueryAgents();
  
  const sessions = sessionsData?.items || [];
  const agents = agentsData?.items || [];
  const hasAgents = agents.length > 0;
  const hasSessions = sessions.length > 0;

  const handleCreateSession = () => {
    if (hasAgents) {
      openWizard();
    } else {
      router.push("/agents");
    }
  };

  if (showWizard) {
    return (
      <SessionWizard
        onSuccess={closeWizard}
        onCancel={closeWizard}
      />
    );
  }

  const handleConfigureSession = (session: SessionGetMany[number]) => {
    router.push(`/sessions/${session.id}`);
  };

  return (
    <div className="space-y-6">
      <SessionsListHeader
        onCreateSession={handleCreateSession}
        hasAgents={hasAgents}
      />
      {hasSessions ? (
      <SessionsList
        sessions={sessions}
        onConfigureSession={handleConfigureSession}
      />
      ) : (
        <SessionsEmptyState onCreateSession={handleCreateSession} hasAgents={hasAgents} />
      )}
    </div>
  );
};