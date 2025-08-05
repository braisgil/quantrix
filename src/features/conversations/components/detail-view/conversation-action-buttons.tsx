'use client';

import { Button } from '@/components/ui/button';
import { Play, Edit, Trash2, MessageSquare } from 'lucide-react';
import { ConversationStatus } from '../../types';

interface ConversationActionButtonsProps {
  conversation: {
    id: string;
    status: string;
  };
  onStartConversation?: () => void;
  onEditConversation?: () => void;
  onDeleteConversation?: () => void;
  onViewTranscript?: () => void;
}

export const ConversationActionButtons: React.FC<ConversationActionButtonsProps> = ({
  conversation,
  onStartConversation,
  onEditConversation,
  onDeleteConversation,
  onViewTranscript,
}) => {
  const canStart = conversation.status === ConversationStatus.Upcoming;
  const canEdit = conversation.status === ConversationStatus.Upcoming;
  const canDelete = conversation.status !== ConversationStatus.Active;

  return (
    <div className="flex flex-wrap gap-3 pt-6 border-t border-border/50">
      {canStart && onStartConversation && (
        <Button
          onClick={onStartConversation}
          className="bg-primary hover:bg-primary/90 text-black font-semibold matrix-glow"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Conversation
        </Button>
      )}

      {onViewTranscript && (
        <Button
          variant="outline"
          onClick={onViewTranscript}
          className="border-primary/20 hover:border-primary/40"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          View Transcript
        </Button>
      )}

      {canEdit && onEditConversation && (
        <Button
          variant="outline"
          onClick={onEditConversation}
          className="border-primary/20 hover:border-primary/40"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      )}

      {canDelete && onDeleteConversation && (
        <Button
          variant="outline"
          onClick={onDeleteConversation}
          className="border-red-500/20 hover:border-red-500/40 text-red-500 hover:text-red-400"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      )}
    </div>
  );
}; 