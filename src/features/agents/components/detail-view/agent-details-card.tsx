'use client';

import { User, Calendar, Zap, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AgentDetailsCardProps {
  agent: {
    id: string;
    createdAt: string;
  };
}

export const AgentDetailsCard = ({ agent }: AgentDetailsCardProps) => {
  return (
    <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
      <div className="flex items-center mb-3">
        <Activity className="w-4 h-4 text-primary mr-2" />
        <h4 className="font-semibold text-primary">Agent Details</h4>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <span>ID: {agent.id}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Created {formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Zap className="h-4 w-4" />
          <span>Status: <span className="text-primary font-medium">Active</span></span>
        </div>
      </div>
    </div>
  );
}; 