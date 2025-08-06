'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ConversationNavigationHeaderProps {
  /** The session ID to navigate back to */
  sessionId?: string;
  /** Custom cancel handler, takes precedence over sessionId navigation */
  onCancel?: () => void;
}

export const ConversationNavigationHeader: React.FC<ConversationNavigationHeaderProps> = ({ 
  sessionId,
  onCancel 
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
      <Button 
        variant="ghost"
        size="sm" 
        onClick={handleBackClick}
        className="text-muted-foreground hover:text-foreground lg:hidden"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}; 