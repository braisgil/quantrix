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
import { useQuerySessions } from '@/features/sessions/api/use-query-sessions';
import { SessionsList } from '@/features/sessions/components/list-view/sessions-list';
import { formatAgentTotalDuration } from '../utils/agent-helpers';
import { Clock, Phone, FolderOpen } from 'lucide-react';

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
          {/* Quick Usage Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <div className="text-sm">
                  <div className="text-muted-foreground">Conversations</div>
                  <div className="text-lg font-semibold text-primary">
                    {Number(agent?.conversationCount || 0)}
                  </div>
                </div>
              </div>
            </div>
            <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <div className="text-sm">
                  <div className="text-muted-foreground">Total Duration</div>
                  <div className="text-lg font-semibold text-primary">
                    {formatAgentTotalDuration(agent?.totalDuration || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AgentDetailsCard agent={agent} />
            <AgentSpecializationCard agent={agent} />
          </div>

          {/* Custom Configuration Summary */}
          <AgentCustomConfigCard agent={agent} />

          {/* Related Sessions */}
          <RelatedSessions agentId={agent?.id} />

          {/* Action Buttons moved to navigation header */}
        </CardContent>
      </div>
    </div>
  );
};

// Embedded related sessions section scoped to this view
const RelatedSessions = ({ agentId }: { agentId?: string }) => {
  const { data } = useQuerySessions({ agentId: agentId || '' });
  const sessions = data?.items || [];

  if (!agentId || sessions.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-3">
        <FolderOpen className="w-4 h-4 text-primary" />
        <h4 className="text-lg font-bold quantrix-gradient matrix-text-glow">Related Sessions</h4>
      </div>
      <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
        <SessionsList sessions={sessions} />
      </div>
    </div>
  );
};