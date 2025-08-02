'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';

interface AgentsListHeaderProps {
  onCreateAgent: () => void;
}

const AgentsListHeader: React.FC<AgentsListHeaderProps> = ({ onCreateAgent }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold quantrix-gradient matrix-text-glow">
          My Agents
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your neural network companions
        </p>
      </div>
      <Button 
        className="bg-primary hover:bg-primary/90 text-black font-semibold matrix-glow" 
        onClick={onCreateAgent}
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Agent
      </Button> 
    </div>
  );
};

export default AgentsListHeader;
