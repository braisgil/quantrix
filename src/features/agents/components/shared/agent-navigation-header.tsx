'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
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
  const backHref = '/agents';

  return (
    <div className="flex items-center justify-between">
      {onCancel ? (
        <Button 
          variant="ghost" 
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Agents
        </Button>
      ) : (
        <Button 
          asChild
          variant="ghost"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          <Link href={backHref}>
            <ArrowLeft className="w-4 h-4" />
            Back to Agents
          </Link>
        </Button>
      )}
      {onDelete && (
        <AgentActionButtons agentName={agentName} onDeleteAgent={onDelete} isDeleting={isDeleting} />
      )}
    </div>
  );
};
