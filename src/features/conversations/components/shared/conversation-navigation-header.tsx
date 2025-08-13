'use client';

import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/confirm-dialog';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ConversationNavigationHeaderProps {
  /** The session ID to navigate back to */
  sessionId?: string;
  /** Custom cancel handler, takes precedence over sessionId navigation */
  onCancel?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export const ConversationNavigationHeader: React.FC<ConversationNavigationHeaderProps> = ({ 
  sessionId,
  onCancel,
  onDelete,
  isDeleting
}) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (onCancel) {
      onCancel();
    } else if (sessionId) {
      router.push(`/sessions/${sessionId}`);
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
        {sessionId ? 'Back to Session' : 'Back to Sessions'}
      </Button>
      {onDelete && (
        <ConfirmDialog
          title="Delete Conversation"
          description="Are you sure you want to delete this conversation? This action cannot be undone."
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