'use client';

import { Button } from '@/components/ui/button';
import { Edit, Settings } from 'lucide-react';

interface AgentActionButtonsProps {
  onEditAgent: () => void;
  onConfigureAgent: () => void;
}

export const AgentActionButtons = ({ 
  onEditAgent, 
  onConfigureAgent 
}: AgentActionButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button 
        onClick={onEditAgent}
        variant="outline" 
        size="sm"
        className="matrix-glow matrix-border"
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit Companion
      </Button>
      <Button 
        onClick={onConfigureAgent}
        variant="default" 
        size="sm"
        className="matrix-glow"
      >
        <Settings className="h-4 w-4 mr-2" />
        Configure Settings
      </Button>
    </div>
  );
}; 