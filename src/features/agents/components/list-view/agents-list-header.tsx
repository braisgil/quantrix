'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';

interface AgentsListHeaderProps {
  onCreateAgent: () => void;
}

const AgentsListHeader: React.FC<AgentsListHeaderProps> = ({ onCreateAgent }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
      <div>
        <h1 className="text-3xl font-bold quantrix-gradient matrix-text-glow">
          My Agents
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your neural network companions
        </p>
      </div>
      <Button 
        className="bg-primary hover:bg-primary/90 text-black font-semibold matrix-glow w-full md:w-auto" 
        onClick={onCreateAgent}
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Agent
      </Button> 
    </div>
  );
};

export default AgentsListHeader;
