'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ConversationActionButtons } from '../detail-view/conversation-action-buttons';

type ConversationNavigationHeaderProps =
  | {
      /** The session ID to navigate back to */
      sessionId?: string;
      /** Custom cancel handler, takes precedence over sessionId navigation */
      onCancel?: () => void;
      onDelete: () => void;
      isDeleting?: boolean;
      conversationName: string;
    }
  | {
      /** The session ID to navigate back to */
      sessionId?: string;
      /** Custom cancel handler, takes precedence over sessionId navigation */
      onCancel?: () => void;
      onDelete?: undefined;
      isDeleting?: boolean;
      conversationName?: string;
    };

export const ConversationNavigationHeader: React.FC<ConversationNavigationHeaderProps> = ({ 
  sessionId,
  onCancel,
  onDelete,
  isDeleting,
  conversationName,
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
        <ConversationActionButtons conversationName={conversationName} onDeleteConversation={onDelete} isDeleting={isDeleting} />
      )}
    </div>
  );
}; 