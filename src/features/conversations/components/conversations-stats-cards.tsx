'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Clock, CheckCircle, Play } from 'lucide-react';

interface ConversationsStatsCardsProps {
  totalConversations: number;
  activeConversations: number;
  completedConversations: number;
  scheduledConversations: number;
  availableConversations: number;
}

const ConversationsStatsCards: React.FC<ConversationsStatsCardsProps> = ({
  totalConversations,
  activeConversations,
  completedConversations,
  scheduledConversations,
  availableConversations,
}) => {
  const stats = [
    {
      title: 'Total Conversations',
      value: totalConversations,
      icon: MessageSquare,
      description: 'All conversations',
      color: 'text-blue-500',
    },
    {
      title: 'Active',
      value: activeConversations,
      icon: Play,
      description: 'Currently running',
      color: 'text-green-500',
    },
    {
      title: 'Completed',
      value: completedConversations,
      icon: CheckCircle,
      description: 'Successfully finished',
      color: 'text-purple-500',
    },
    {
      title: 'Scheduled',
      value: scheduledConversations,
      icon: Clock,
      description: 'Scheduled sessions',
      color: 'text-yellow-500',
    },
    {
      title: 'Available',
      value: availableConversations,
      icon: Play,
      description: 'Available to join',
      color: 'text-green-500',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="matrix-card">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-primary/10 rounded-lg matrix-glow`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <CardTitle className="text-lg">{stat.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary matrix-text-glow">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ConversationsStatsCards; 