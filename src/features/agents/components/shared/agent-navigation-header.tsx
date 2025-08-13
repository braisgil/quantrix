'use client';

import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/confirm-dialog';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AgentNavigationHeaderProps {
  onCancel?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export const AgentNavigationHeader = ({ onCancel, onDelete, isDeleting }: AgentNavigationHeaderProps) => {
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
        <ConfirmDialog
          title="Delete Agent"
          description="Are you sure you want to delete this agent? This action cannot be undone and will also remove all associated sessions and conversations."
          confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
          onConfirm={onDelete}
          isLoading={Boolean(isDeleting)}
          confirmButtonClassName="bg-destructive hover:bg-destructive/90 text-white font-semibold"
        >
          <Button 
            size="sm"
            className="bg-destructive hover:bg-destructive/90 text-white font-semibold"
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </Button>
        </ConfirmDialog>
      )}
    </div>
  );
};
