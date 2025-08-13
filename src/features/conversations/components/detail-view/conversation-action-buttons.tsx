'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/confirm-dialog';
import { Play, Edit, Trash2, MessageSquare } from 'lucide-react';
import { ConversationStatus } from '../../types';

interface ConversationActionButtonsProps {
  conversation: {
    id: string;
    name: string;
    status: string;
    sessionId: string;
  };
  onStartConversation?: () => void;
  onEditConversation?: () => void;
  onViewTranscript?: () => void;
  onDeleteConversation?: () => void;
  isDeleting?: boolean;
}

export const ConversationActionButtons: React.FC<ConversationActionButtonsProps> = ({
  conversation,
  onStartConversation,
  onEditConversation,
  onViewTranscript,
  onDeleteConversation,
  isDeleting,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    onDeleteConversation?.();
    setIsDeleteDialogOpen(false);
  };

  const canStart = conversation.status === ConversationStatus.Upcoming;
  const canEdit = conversation.status === ConversationStatus.Upcoming;
  const canDelete = conversation.status === ConversationStatus.Upcoming;

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {canStart && onStartConversation && (
        <Button
          onClick={onStartConversation}
          size="sm"
          variant="call"
          className="font-semibold matrix-glow w-full sm:w-auto"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Conversation
        </Button>
      )}

      {onViewTranscript && (
        <Button
          onClick={onViewTranscript}
          size="sm"
          variant="view"
          className="font-semibold w-full sm:w-auto"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          View Transcript
        </Button>
      )}

      {canEdit && onEditConversation && (
        <Button
          variant="outline"
          size="sm"
          onClick={onEditConversation}
          className="matrix-glow matrix-border w-full sm:w-auto"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      )}

      {canDelete && onDeleteConversation && (
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Conversation"
          description={
            <span>
              Are you sure you want to delete &ldquo;{conversation.name}&rdquo;? This action cannot be undone.
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