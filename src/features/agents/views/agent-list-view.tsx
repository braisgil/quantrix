'use client';

import { useQueryAgents } from '../api/use-query-agents';
import type { AgentsGetMany } from '../types';
import { calculateAgentStats } from '../utils/agent-helpers';
import { AgentStatsCards, AgentsList, AgentsEmptyState, AgentsListHeader } from '../components';
import { useWizardState } from '../hooks/use-wizard-state';
import { AgentWizard } from '../components/wizard/components/AgentWizard';

export const AgentListView = () => {
  const { showWizard, openWizard, closeWizard } = useWizardState();
  const { data: agentsData } = useQueryAgents();
  const agents = agentsData.items || [];
  const { activeAgents, totalSessions, totalUptime } = calculateAgentStats(agents);

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
    // TODO: Implement agent configuration
    console.log('Configure agent:', agent.name);
  };

  return (
    <div className="space-y-8">
      <AgentsListHeader onCreateAgent={openWizard} />
      <div className="space-y-8">
        <AgentStatsCards
          activeAgents={activeAgents}
          totalSessions={totalSessions}
          totalUptime={totalUptime}
        />

        {agents.length > 0 ? (
          <AgentsList 
            agents={agents}
            onConfigureAgent={handleConfigureAgent}
          />
        ) : (
          <AgentsEmptyState />
        )}
      </div>
    </div>
  );
};


