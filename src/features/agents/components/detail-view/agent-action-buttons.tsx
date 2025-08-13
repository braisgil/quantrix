'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/confirm-dialog';
import { Trash2 } from 'lucide-react';

interface AgentActionButtonsProps {
  agentName: string;
  onDeleteAgent?: () => void;
  isDeleting?: boolean;
}

export const AgentActionButtons = ({ 
  agentName,
  onDeleteAgent,
  isDeleting,
}: AgentActionButtonsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    onDeleteAgent?.();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {onDeleteAgent && (
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Agent"
          description={
            <span>
              Are you sure you want to delete &ldquo;{agentName}&rdquo;? This action cannot be undone and will also delete all associated sessions and conversations.
            </span>
          }
          confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
          onConfirm={handleDelete}
          isLoading={Boolean(isDeleting)}
          confirmButtonClassName="bg-destructive hover:bg-destructive/90 text-white font-semibold w-full sm:w-auto"
          cancelButtonClassName="w-full sm:w-auto"
        >
          <Button 
            size="sm"
            className="bg-destructive hover:bg-destructive/90 text-white font-semibold w-full sm:w-auto"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </Button>
        </ConfirmDialog>
      )}
    </div>
  );
}; 