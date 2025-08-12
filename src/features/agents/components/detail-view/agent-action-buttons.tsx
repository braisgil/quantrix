'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/confirm-dialog';
import { Edit, Settings, Trash2 } from 'lucide-react';
import { useDeleteAgent } from '../../api/use-delete-agent';
import { useRouter } from 'next/navigation';

interface AgentActionButtonsProps {
  agentId: string;
  agentName: string;
  onEditAgent: () => void;
  onConfigureAgent: () => void;
}

export const AgentActionButtons = ({ 
  agentId,
  agentName,
  onEditAgent, 
  onConfigureAgent 
}: AgentActionButtonsProps) => {
  const router = useRouter();
  const deleteAgentMutation = useDeleteAgent();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteAgentMutation.mutate({ id: agentId });
    setIsDeleteDialogOpen(false);
    // Redirect to agents list after deletion
    router.push('/agents');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button 
        onClick={onEditAgent}
        variant="outline" 
        size="sm"
        className="matrix-glow matrix-border w-full sm:w-auto"
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit Companion
      </Button>
      <Button 
        onClick={onConfigureAgent}
        variant="default" 
        size="sm"
        className="matrix-glow w-full sm:w-auto"
      >
        <Settings className="h-4 w-4 mr-2" />
        Configure Settings
      </Button>
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Agent"
        description={
          <span>
            Are you sure you want to delete &ldquo;{agentName}&rdquo;? This action cannot be undone and will also delete all associated sessions and conversations.
          </span>
        }
        confirmLabel={deleteAgentMutation.isPending ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        isLoading={deleteAgentMutation.isPending}
        confirmButtonClassName="bg-destructive hover:bg-destructive/90 text-white dark:text-black font-semibold w-full sm:w-auto"
        cancelButtonClassName="w-full sm:w-auto"
      >
        <Button 
          size="sm"
          className="bg-destructive hover:bg-destructive/90 text-white dark:text-black font-semibold w-full sm:w-auto"
          disabled={deleteAgentMutation.isPending}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          <span>{deleteAgentMutation.isPending ? 'Deleting...' : 'Delete'}</span>
        </Button>
      </ConfirmDialog>
    </div>
  );
}; 