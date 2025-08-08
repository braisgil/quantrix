'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Play, Edit, Trash2, MessageSquare } from 'lucide-react';
import { ConversationStatus } from '../../types';
import { useDeleteConversation } from '../../api/use-delete-conversation';
import { useRouter } from 'next/navigation';

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
}

export const ConversationActionButtons: React.FC<ConversationActionButtonsProps> = ({
  conversation,
  onStartConversation,
  onEditConversation,
  onViewTranscript,
}) => {
  const router = useRouter();
  const deleteConversationMutation = useDeleteConversation({ sessionId: conversation.sessionId });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteConversationMutation.mutate({ id: conversation.id });
    setIsDeleteDialogOpen(false);
    // Redirect to conversations list after deletion
    router.push('/conversations');
  };

  const canStart = conversation.status === ConversationStatus.Upcoming;
  const canEdit = conversation.status === ConversationStatus.Upcoming;
  const canDelete = conversation.status === ConversationStatus.Upcoming;

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
          onClick={onViewTranscript}
          className="bg-blue-500 hover:bg-blue-500/90 text-white dark:text-black font-semibold"
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

      {canDelete && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button 
              size="sm"
              className="bg-destructive hover:bg-destructive/90 text-white dark:text-black font-semibold w-full sm:w-auto"
              disabled={deleteConversationMutation.isPending}
            >
              {deleteConversationMutation.isPending ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span>Delete</span>
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Are you sure you want to delete &ldquo;{conversation.name}&rdquo;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90 text-white dark:text-black font-semibold w-full sm:w-auto"
                disabled={deleteConversationMutation.isPending}
              >
                              {deleteConversationMutation.isPending ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Delete</span>
                </>
              )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}; 