import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Clock, Phone } from 'lucide-react';

interface AgentStatsCardsProps {
  activeAgents: number;
  totalConversations: number;
  totalDurationFormatted: string;
}

const AgentStatsCards: React.FC<AgentStatsCardsProps> = ({
  activeAgents,
  totalConversations,
  totalDurationFormatted,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="matrix-card">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Active Agents</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary matrix-text-glow">{activeAgents}</div>
          <p className="text-sm text-muted-foreground">AI agents online</p>
        </CardContent>
      </Card>

      <Card className="matrix-card">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Total Conversations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary matrix-text-glow">{totalConversations}</div>
          <p className="text-sm text-muted-foreground">Conversations completed</p>
        </CardContent>
      </Card>

      <Card className="matrix-card">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Total Duration</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary matrix-text-glow">{totalDurationFormatted}</div>
          <p className="text-sm text-muted-foreground">Time spent with agents</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentStatsCards;