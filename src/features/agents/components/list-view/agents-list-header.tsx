'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';

interface AgentsListHeaderProps {
  onCreateAgent: () => void;
  canCreate?: boolean;
}

const AgentsListHeader: React.FC<AgentsListHeaderProps> = ({ onCreateAgent, canCreate = true }) => {
  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-bold quantrix-gradient matrix-text-glow">
            My Agents
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your network of AI companions
          </p>
        </div>
        <Button 
          className={canCreate 
            ? "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold matrix-glow w-full md:w-auto" 
            : "opacity-50 cursor-not-allowed w-full md:w-auto"}
          onClick={onCreateAgent}
          disabled={!canCreate}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Agent
        </Button> 
      </div>
      {(!canCreate) && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mt-2">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            You have reached the maximum number of free agents.
          </p>
        </div>
      )}
    </>
  );
};

export { AgentsListHeader };
