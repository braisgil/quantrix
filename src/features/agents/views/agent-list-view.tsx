'use client';

import { useState } from 'react';
import { useDeleteAgent } from '../api/use-delete-agent';
import { useQueryAgents } from '../api/use-query-agents';
import { AgentStatsCards, AgentsList, AgentsEmptyState, AgentsListHeader } from '../components';
import { AgentWizard } from '../components/wizard/components/agent-wizard';
import { useWizardState } from '../hooks/use-wizard-state';
import  { type AgentItem } from '../types';
import { calculateAgentStats } from '../utils/agent-helpers';
import { useCreateAgent } from '../api/use-create-agent';

export const AgentListView = () => {
  const { showWizard, openWizard, closeWizard } = useWizardState();
  const { data: agentsData } = useQueryAgents();
  const agents = agentsData.items || [];
  const { activeAgents, totalConversations, totalDurationFormatted } = calculateAgentStats(agents);
  const deleteAgentMutation = useDeleteAgent();
  const createAgentMutation = useCreateAgent();
  const [deletingAgentId, setDeletingAgentId] = useState<string | undefined>(undefined);

  if (showWizard) {
    return (
      <div className="space-y-0">
        <AgentWizard 
          onCancel={closeWizard}
          onSubmit={(data) => {
            createAgentMutation.mutate(data, {
              onSuccess: () => {
                closeWizard();
              }
            });
          }}
          isSubmitting={createAgentMutation.isPending}
        />
      </div>
    );
  }

  const handleDeleteAgent = (agent: AgentItem) => {
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


