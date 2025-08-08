'use client';

import { Button } from '@/components/ui/button';
import { Plus, MessageSquare } from 'lucide-react';

interface SessionActionButtonsProps {
  onCreateConversation: () => void;
  onStartChat: () => void;
}

export const SessionActionButtons = ({ 
  onCreateConversation, 
  onStartChat 
}: SessionActionButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button 
        onClick={onCreateConversation}
        variant="outline" 
        size="sm"
        className="matrix-glow matrix-border"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Conversation
      </Button>
      <Button 
        onClick={onStartChat}
        variant="default" 
        size="sm"
        className="matrix-glow"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Start Chat
      </Button>
    </div>
  );
};