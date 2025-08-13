'use client';

import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/confirm-dialog";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SessionNavigationHeaderProps {
  onCancel?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export const SessionNavigationHeader = ({ onCancel, onDelete, isDeleting }: SessionNavigationHeaderProps) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/sessions');
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
        Back to Sessions
      </Button>
      {onDelete && (
        <ConfirmDialog
          title="Delete Session"
          description="Are you sure you want to delete this session? This action cannot be undone and will also remove all associated conversations."
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