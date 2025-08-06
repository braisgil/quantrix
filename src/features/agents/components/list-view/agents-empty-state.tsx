import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, UserRoundPlus, Settings } from 'lucide-react';

const AgentsEmptyState: React.FC = () => {
  return (
    <Card className="matrix-card">
      <CardContent className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center matrix-glow mb-6">
          <UserRoundPlus className="w-12 h-12 text-primary matrix-text-glow" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No AI Agents Yet
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Start building your AI companion network by creating your first agent. 
          Each agent can be specialized for different tasks and learning domains.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <Settings className="w-4 h-4 mr-2" />
            Explore limitless configurations
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            Available 24/7
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentsEmptyState;