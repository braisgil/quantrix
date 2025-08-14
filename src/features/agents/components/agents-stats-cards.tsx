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
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-primary">{activeAgents}</div>
                  <div className="text-xs text-muted-foreground">Agents</div>
                </div>
              </div>
              
              <div className="w-px h-12 bg-border/30"></div>
              
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-primary">{totalConversations}</div>
                  <div className="text-xs text-muted-foreground">Convos</div>
                </div>
              </div>
              
              <div className="w-px h-12 bg-border/30"></div>
              
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-primary">{totalDurationFormatted}</div>
                  <div className="text-xs text-muted-foreground">Time</div>
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

export { AgentStatsCards };