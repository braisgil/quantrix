'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/confirm-dialog';
import { Loader2, Trash2 } from 'lucide-react';

interface SessionActionButtonsProps {
  sessionName: string;
  onDeleteSession?: () => void;
  isDeleting?: boolean;
}

export const SessionActionButtons = ({
  sessionName,
  onDeleteSession,
  isDeleting,
}: SessionActionButtonsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    onDeleteSession?.();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {onDeleteSession && (
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Session"
          description={
            <span>
              Are you sure you want to delete &ldquo;{sessionName}&rdquo;? This action cannot be undone and will also delete all associated conversations.
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
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </Button>
        </ConfirmDialog>
      )}
    </div>
  );
};