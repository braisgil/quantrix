'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AgentActionButtons } from '../detail-view/agent-action-buttons';

type AgentNavigationHeaderProps =
  | {
      onCancel?: () => void;
      onDelete: () => void;
      isDeleting?: boolean;
      agentName: string;
    }
  | {
      onCancel?: () => void;
      onDelete?: undefined;
      isDeleting?: boolean;
      agentName?: string;
    };

export const AgentNavigationHeader = ({ onCancel, onDelete, isDeleting, agentName }: AgentNavigationHeaderProps) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/agents');
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Button 
        variant="ghost" 
        onClick={handleBackClick}
        className="text-muted-foreground hover:text-foreground flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Agents
      </Button>
      {onDelete && (
        <AgentActionButtons agentName={agentName} onDeleteAgent={onDelete} isDeleting={isDeleting} />
      )}
    </div>
  );
};
