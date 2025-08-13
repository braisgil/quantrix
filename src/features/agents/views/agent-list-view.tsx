'use client';

import { useRouter } from 'next/navigation';
import { useQueryAgents } from '../api/use-query-agents';
import type { AgentsGetMany } from '../types';
import { calculateAgentStats } from '../utils/agent-helpers';
import { AgentStatsCards, AgentsList, AgentsEmptyState, AgentsListHeader } from '../components';
import { useWizardState } from '../hooks/use-wizard-state';
import { AgentWizard } from '../components/wizard/components/agent-wizard';
import { useDeleteAgent } from '../api/use-delete-agent';
import { useState } from 'react';

export const AgentListView = () => {
  const router = useRouter();
  const { showWizard, openWizard, closeWizard } = useWizardState();
  const { data: agentsData } = useQueryAgents();
  const agents = agentsData.items || [];
  const { activeAgents, totalConversations, totalDurationFormatted } = calculateAgentStats(agents);
  const deleteAgentMutation = useDeleteAgent();
  const [deletingAgentId, setDeletingAgentId] = useState<string | undefined>(undefined);

  if (showWizard) {
    return (
      <div className="space-y-0">
        <AgentWizard 
          onSuccess={closeWizard}
          onCancel={closeWizard}
        />
      </div>
    );
  }

  const handleConfigureAgent = (agent: AgentsGetMany[number]) => {
    router.push(`/agents/${agent.id}`);
  };

  const handleDeleteAgent = (agent: AgentsGetMany[number]) => {
    setDeletingAgentId(agent.id);
    deleteAgentMutation.mutate({ id: agent.id }, {
      onSettled: () => setDeletingAgentId(undefined),
    });
  };

  return (
    <div className="space-y-8">
      <AgentsListHeader onCreateAgent={openWizard} />
      <div className="space-y-8">
        {agents.length > 0 ? (
          <>
            <AgentStatsCards
              activeAgents={activeAgents}
              totalConversations={totalConversations}
              totalDurationFormatted={totalDurationFormatted}
            />
            <AgentsList 
              agents={agents}
              onConfigureAgent={handleConfigureAgent}
              onDeleteAgent={handleDeleteAgent}
              deletingAgentId={deletingAgentId}
            />
          </>
        ) : (
          <AgentsEmptyState />
        )}
      </div>
    </div>
  );
};


