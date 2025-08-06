import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageSquare, Sparkles, Brain, Target, ExternalLink } from 'lucide-react';
import type { AgentsGetMany } from '../../types';
import { getAgentIcon, formatAgentTotalDuration } from '../../utils/agent-helpers';
import { formatCategoryName, getSubSubcategoryName } from '../../utils/category-helpers';

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
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 bg-muted/50 rounded-lg border border-primary/20 hover:matrix-border transition-all duration-300">
      <div className="flex-1 w-full">
        {/* Group 1: Icon, Name, and Badges */}
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="hidden sm:block p-3 bg-primary/10 rounded-lg matrix-glow flex-shrink-0">
            <IconComponent className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">{agent.name}</h3>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">
                <Brain className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">{formatCategoryName(agent.category)}</span>
                <span className="sm:hidden">{formatCategoryName(agent.category).split(' ')[0]}</span>
              </Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">
                <Target className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">{formatCategoryName(agent.subcategory)}</span>
                <span className="sm:hidden">{formatCategoryName(agent.subcategory).split(' ')[0]}</span>
              </Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">{getSubSubcategoryName(agent.category, agent.subcategory, agent.subSubcategory)}</span>
                <span className="sm:hidden">{getSubSubcategoryName(agent.category, agent.subcategory, agent.subSubcategory).split(' ')[0]}</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Group 2: Description and Stats */}
        <div className="mt-3 sm:mt-4">
          {agent.description && (
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
              {agent.description}
            </p>
          )}
          {/* Enhanced stats - always on same line */}
          <div className="flex items-center gap-2 sm:gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 bg-muted/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border/50">
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-primary/70" />
              <span>{agent.conversationCount} conversation{agent.conversationCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border/50">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary/70" />
              <span>{formatAgentTotalDuration(agent.totalDuration)} conversation time</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end sm:justify-start space-x-3 mt-3 sm:mt-0 sm:ml-4">
        <Button 
          size="sm" 
          variant="outline" 
          className="matrix-border hover:matrix-glow w-full sm:w-auto"
          onClick={handleConfigure}
        >
          <ExternalLink className="w-4 h-4" />
          <span className="ml-2 sm:hidden">View</span>
        </Button>
      </div>
    </div>
  );
};

export default AgentListItem;