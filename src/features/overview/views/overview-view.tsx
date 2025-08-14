'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useQueryAgents } from '@/features/agents/api/use-query-agents';
import { AgentsList, AgentStatsCards, AgentsEmptyState } from '@/features/agents/components';
import { calculateAgentStats } from '@/features/agents/utils/agent-helpers';
import { useDeleteAgent } from '@/features/agents/api/use-delete-agent';
import type { AgentItem } from '@/features/agents/types';

import { useQueryConversations } from '@/features/conversations/api/use-query-conversations';
import { ConversationsStatsCards } from '@/features/conversations/components';
import { ConversationStatus } from '@/features/conversations/types';
import { useQuerySessions } from '@/features/sessions/api/use-query-sessions';
import { SessionsList } from '@/features/sessions/components';
import type { SessionItem } from '@/features/sessions/types';
import { useDeleteSession } from '@/features/sessions/api/use-delete-session';

export const OverviewView = () => {
  const router = useRouter();

  // Agents data and actions
  const { data: agentsData } = useQueryAgents();
  const agents = agentsData.items || [];
  const { activeAgents, totalConversations: totalAgentConversations, totalDurationFormatted } = calculateAgentStats(agents);
  const deleteAgentMutation = useDeleteAgent();
  const [deletingAgentId, setDeletingAgentId] = useState<string | undefined>(undefined);

  const handleConfigureAgent = (agent: AgentItem) => {
    router.push(`/agents/${agent.id}`);
  };

  const handleDeleteAgent = (agent: AgentItem) => {
    setDeletingAgentId(agent.id);
    deleteAgentMutation.mutate({ id: agent.id }, {
      onSettled: () => setDeletingAgentId(undefined),
    });
  };

  // Conversations data for stats
  const { data: conversationsData } = useQueryConversations();
  const conversations = conversationsData.items || [];

  const conversationsStats = (() => {
    const totalConversations = conversations.length;
    const activeConversations = conversations.filter(c => c.status === ConversationStatus.Active).length;
    const completedConversations = conversations.filter(c => c.status === ConversationStatus.Completed).length;
    const scheduledConversations = conversations.filter(c => c.status === ConversationStatus.Scheduled).length;
    const availableConversations = conversations.filter(c => c.status === ConversationStatus.Available).length;

    return {
      totalConversations,
      activeConversations,
      completedConversations,
      scheduledConversations,
      availableConversations,
    };
  })();

  const hasAgents = agents.length > 0;

  // Sessions data and actions
  const { data: sessionsData } = useQuerySessions();
  const sessions = sessionsData?.items || [];
  const hasSessions = sessions.length > 0;
  const deleteSessionMutation = useDeleteSession();
  const [deletingSessionId, setDeletingSessionId] = useState<string | undefined>(undefined);

  const handleConfigureSession = (session: SessionItem) => {
    router.push(`/sessions/${session.id}`);
  };

  const handleDeleteSession = (session: SessionItem) => {
    setDeletingSessionId(session.id);
    deleteSessionMutation.mutate({ id: session.id }, {
      onSettled: () => setDeletingSessionId(undefined),
    });
  };

  const sessionsStats = (() => {
    const totalSessions = sessions.length;
    const activeSessions = sessions.filter(s => s.status === 'active').length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const archivedSessions = sessions.filter(s => s.status === 'archived').length;
    return { totalSessions, activeSessions, completedSessions, archivedSessions };
  })();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold quantrix-gradient matrix-text-glow">Overview</h1>
        <p className="text-muted-foreground mt-2">Unified snapshot of your agents and conversations</p>
      </div>

      {/* Stats */}
      <div className="space-y-8">
        <AgentStatsCards
          activeAgents={activeAgents}
          totalConversations={totalAgentConversations}
          totalDurationFormatted={totalDurationFormatted}
        />

        <ConversationsStatsCards
          totalConversations={conversationsStats.totalConversations}
          activeConversations={conversationsStats.activeConversations}
          completedConversations={conversationsStats.completedConversations}
          scheduledConversations={conversationsStats.scheduledConversations}
          availableConversations={conversationsStats.availableConversations}
        />
      </div>

      {/* Agents list */}
      <div>
        {hasAgents ? (
          <AgentsList
            agents={agents}
            onConfigureAgent={handleConfigureAgent}
            onDeleteAgent={handleDeleteAgent}
            deletingAgentId={deletingAgentId}
          />
        ) : (
          <AgentsEmptyState />
        )}
      </div>

      {/* Sessions list (compact) */}
      {hasSessions && (
        <div>
          <SessionsList
            sessions={sessions.slice(0, 5)}
            onConfigureSession={handleConfigureSession}
            onDeleteSession={handleDeleteSession}
            deletingSessionId={deletingSessionId}
          />
        </div>
      )}
    </div>
  );
};


