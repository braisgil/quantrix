import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AgentsGetMany } from '../../types';
import AgentListItem from './agent-list-item';

interface AgentsListProps {
  agents: AgentsGetMany;
  onConfigureAgent?: (agent: AgentsGetMany[number]) => void;
}

const AgentsList: React.FC<AgentsListProps> = ({ 
  agents, 
  onConfigureAgent 
}) => {
  return (
    <div>
      <CardHeader className="px-0 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <CardTitle className="text-lg font-bold quantrix-gradient matrix-text-glow">
            Agent Network
          </CardTitle>
        </div>
        <CardDescription>
          AI companions ready to enhance your digital experience
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        {agents.map((agent) => (
          <AgentListItem
            key={agent.id}
            agent={agent}
            onConfigure={onConfigureAgent}
          />
        ))}
      </CardContent>
    </div>
  );
};

export default AgentsList;