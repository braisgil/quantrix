'use client';

import { useQueryAgent } from '../api/use-query-agent';
import { Card, CardContent } from '@/components/ui/card';
import {
  AgentNavigationHeader,
  AgentHeader,
  AgentDetailsCard,
  AgentSpecializationCard,
  AgentCustomConfigCard,
  AgentActionButtons
} from '../components';

interface AgentDetailViewProps {
  agentId: string;
}

export const AgentDetailView = ({ agentId }: AgentDetailViewProps) => {
  const { data: agent } = useQueryAgent(agentId);

  const handleConfigureAgent = () => {
    // TODO: Implement agent configuration
    console.log('Configure agent:', agent.name);
  };

  const handleEditAgent = () => {
    // TODO: Implement agent editing
    console.log('Edit agent:', agent.name);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Navigation Header */}
      <AgentNavigationHeader />

      {/* Main Agent Detail Card */}
      <Card className="w-full mx-auto matrix-card border-primary/20 backdrop-blur-md">
        <AgentHeader agent={agent} />

        <CardContent className="pb-4 sm:pb-6">
          {/* Agent Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AgentDetailsCard agent={agent} />
            <AgentSpecializationCard agent={agent} />
          </div>

          {/* Custom Configuration Summary */}
          <AgentCustomConfigCard agent={agent} />

          {/* Action Buttons */}
          <AgentActionButtons
            onEditAgent={handleEditAgent}
            onConfigureAgent={handleConfigureAgent}
          />
        </CardContent>
      </Card>
    </div>
  );
};