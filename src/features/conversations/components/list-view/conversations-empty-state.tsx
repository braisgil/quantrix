import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Users, Calendar } from 'lucide-react';

const ConversationsEmptyState: React.FC = () => {
  return (
    <Card className="matrix-card">
      <CardContent className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center matrix-glow mb-6">
          <MessageSquare className="w-12 h-12 text-primary matrix-text-glow" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No Conversations Yet
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Start your first AI conversation by selecting an agent. 
          Each conversation is a unique session with your chosen AI companion.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-2" />
            Interactive AI sessions
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            Available anytime
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { ConversationsEmptyState }; 