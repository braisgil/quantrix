import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, Activity } from 'lucide-react';

interface AgentStatsCardsProps {
  activeAgents: number;
  totalSessions: number;
  totalUptime: string;
}

const AgentStatsCards: React.FC<AgentStatsCardsProps> = ({
  activeAgents,
  totalSessions,
  totalUptime,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="matrix-card">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Active Agents</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary matrix-text-glow">{activeAgents}</div>
          <p className="text-sm text-muted-foreground">Neural companions online</p>
        </CardContent>
      </Card>

      <Card className="matrix-card">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Total Sessions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary matrix-text-glow">{totalSessions}</div>
          <p className="text-sm text-muted-foreground">Interactions completed</p>
        </CardContent>
      </Card>

      <Card className="matrix-card">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">System Uptime</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary matrix-text-glow">{totalUptime}</div>
          <p className="text-sm text-muted-foreground">Matrix stability</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentStatsCards;