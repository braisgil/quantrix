'use client';

import { useQueryAgent } from '../api/use-query-agent';
import { CardContent } from '@/components/ui/card';
import { 
  AgentNavigationHeader,
  AgentHeader,
  AgentDetailsCard,
  AgentSpecializationCard,
  AgentCustomConfigCard
} from '../components';
import { useDeleteAgent } from '../api/use-delete-agent';
import { useRouter } from 'next/navigation';

interface AgentDetailViewProps {
  agentId: string;
}

export const AgentDetailView = ({ agentId }: AgentDetailViewProps) => {
  const { data: agent } = useQueryAgent(agentId);
  const router = useRouter();
  const deleteAgentMutation = useDeleteAgent();

  // Removed edit/configure actions; using delete-only per new pattern

  const handleDeleteAgent = () => {
    if (!agent) return;
    deleteAgentMutation.mutate(
      { id: agent.id },
      {
        onSuccess: () => {
          router.push('/agents');
        },
      }
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Navigation Header */}
      <AgentNavigationHeader 
        agentName={agent?.name}
        onDelete={handleDeleteAgent}
        isDeleting={deleteAgentMutation.isPending}
      />

      {/* Main Agent Detail Card */}
      <div>
        <AgentHeader agent={agent} />

        <CardContent className="pb-4 sm:pb-6 px-0">
          {/* Agent Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AgentDetailsCard agent={agent} />
            <AgentSpecializationCard agent={agent} />
          </div>

          {/* Custom Configuration Summary */}
          <AgentCustomConfigCard agent={agent} />

          {/* Action Buttons moved to navigation header */}
        </CardContent>
      </div>
    </div>
  );
};