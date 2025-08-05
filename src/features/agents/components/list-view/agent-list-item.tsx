import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Clock, MessageSquare } from 'lucide-react';
import type { AgentsGetMany } from '../../types';
import { getAgentIcon, formatAgentTotalDuration } from '../../utils/agent-helpers';
import { formatCategoryName } from '../../utils/category-helpers';

interface AgentListItemProps {
  agent: AgentsGetMany[number];
  onConfigure?: (agent: AgentsGetMany[number]) => void;
}

const AgentListItem: React.FC<AgentListItemProps> = ({ 
  agent, 
  onConfigure 
}) => {
  const IconComponent = getAgentIcon(agent);

  const handleConfigure = () => {
    onConfigure?.(agent);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-primary/20 hover:matrix-border transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-lg matrix-glow">
          <IconComponent className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{agent.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {formatCategoryName(agent.category)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {formatCategoryName(agent.subcategory)}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{agent.conversationCount} conversation{agent.conversationCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatAgentTotalDuration(agent.totalDuration)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button 
          size="sm" 
          variant="outline" 
          className="matrix-border hover:matrix-glow"
          onClick={handleConfigure}
        >
          <Settings className="w-4 h-4 mr-1" />
          Configure
        </Button>
      </div>
    </div>
  );
};

export default AgentListItem;