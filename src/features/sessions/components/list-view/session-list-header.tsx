'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';

interface SessionsListHeaderProps {
  onCreateSession: () => void;
  hasAgents: boolean;
}

const SessionsListHeader: React.FC<SessionsListHeaderProps> = ({ onCreateSession, hasAgents }) => {
  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-bold quantrix-gradient matrix-text-glow">
            My Sessions
          </h1>
          <p className="text-muted-foreground mt-2">
            Organize your AI conversations by topic
          </p>
        </div>
        <Button 
          onClick={onCreateSession}
          disabled={!hasAgents}
            className={hasAgents 
              ? "bg-primary hover:bg-primary/90 text-black font-semibold matrix-glow w-full md:w-auto"
              : "opacity-50 cursor-not-allowed"
            }
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Session
        </Button> 
      </div>
      {!hasAgents && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            You need to create at least one AI agent before you can create sessions.
          </p>
        </div>
      )}
    </>
  );
};

export default SessionsListHeader; 