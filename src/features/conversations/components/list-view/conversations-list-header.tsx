'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';

interface ConversationsListHeaderProps {
  onCreateConversation: () => void;
}

const ConversationsListHeader: React.FC<ConversationsListHeaderProps> = ({ onCreateConversation }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold quantrix-gradient matrix-text-glow">
          My Conversations
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your AI conversation sessions
        </p>
      </div>
      <Button 
        className="bg-primary hover:bg-primary/90 text-black font-semibold matrix-glow" 
        onClick={onCreateConversation}
      >
        <Plus className="w-4 h-4 mr-2" />
        Start Conversation
      </Button> 
    </div>
  );
};

export default ConversationsListHeader; 