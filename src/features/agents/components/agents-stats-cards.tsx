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
    <>
      {/* Ultra-compact stats bar for mobile/tablet */}
      <div className="lg:hidden">
        <Card className="matrix-card shadow-none">
          <CardContent className="p-2 sm:p-3">
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="flex items-center justify-center gap-1 px-1">
                <Bot className="w-3 h-3 text-primary" />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-primary">{activeAgents}</span>
                  <span className="text-xs text-muted-foreground">Agents</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 px-1">
                <Phone className="w-3 h-3 text-primary" />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-primary">{totalConversations}</span>
                  <span className="text-xs text-muted-foreground">Convos</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 px-1">
                <Clock className="w-3 h-3 text-primary" />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-primary">{totalDurationFormatted}</span>
                  <span className="text-xs text-muted-foreground">Duration</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Original layout for desktop */}
      <div className="hidden lg:grid grid-cols-3 gap-6">
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
    </>
  );
};

export default AgentStatsCards;