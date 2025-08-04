import React from 'react';
import { useQueryAgents } from '../api/use-query-agents';
import type { Agent } from '../types';
import { calculateAgentStats } from '../utils';
import { AgentStatsCards, AgentsList, AgentsEmptyState } from '../components';

const AgentsPageView: React.FC = () => {
  // With useSuspenseQuery, data is guaranteed to be defined
  // Loading states are handled by Suspense boundaries
  // Errors bubble up to error boundaries automatically
  const { data: agentsData } = useQueryAgents();

  const agents = agentsData.items || [];
  const { activeAgents, totalSessions, totalUptime } = calculateAgentStats(agents);

  const handleConfigureAgent = (agent: Agent) => {
    // TODO: Implement agent configuration
    console.log('Configure agent:', agent.name);
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <AgentStatsCards
        activeAgents={activeAgents}
        totalSessions={totalSessions}
        totalUptime={totalUptime}
      />

      {/* Agents List or Empty State */}
      {agents.length > 0 ? (
        <AgentsList 
          agents={agents}
          onConfigureAgent={handleConfigureAgent}
        />
      ) : (
        <AgentsEmptyState />
      )}
    </div>
  );
};

export default AgentsPageView;
