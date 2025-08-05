import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="matrix-card">
      <CardHeader>
        <CardTitle className="text-xl">Your Neural Network</CardTitle>
        <CardDescription>
          AI agents ready to enhance your digital experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {agents.map((agent) => (
          <AgentListItem
            key={agent.id}
            agent={agent}
            onConfigure={onConfigureAgent}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default AgentsList;