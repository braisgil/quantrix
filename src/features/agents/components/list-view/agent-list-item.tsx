'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ConfirmDialog from '@/components/confirm-dialog';
import { Clock, MessageSquare, Sparkles, Brain, Target, ExternalLink, Trash2 } from 'lucide-react';
import type { AgentItem } from '../../types';
import { getAgentIcon, formatAgentTotalDuration } from '../../utils/agent-helpers';
import { formatCategoryName, getSubSubcategoryName } from '../../utils/category-helpers';
// mutations are handled by parent; this component is presentational

interface AgentListItemProps {
  agent: AgentItem;
  onConfigure?: (agent: AgentItem) => void;
  onDelete?: (agent: AgentItem) => void;
  isDeleting?: boolean;
}

const AgentListItem: React.FC<AgentListItemProps> = ({ 
  agent, 
  onConfigure,
  onDelete,
  isDeleting,
}) => {
  const IconComponent = getAgentIcon(agent);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleConfigure = () => {
    onConfigure?.(agent);
  };

  const handleDelete = () => {
    onDelete?.(agent);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="matrix-card flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 sm:p-5 bg-muted/50 rounded-lg border border-primary/20 hover:matrix-border transition-all duration-300">
      <div className="flex-1 w-full">
        {/* Group 1: Icon, Name, and Badges */}
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-primary/10 rounded-lg matrix-glow flex-shrink-0">
            <IconComponent className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-base sm:text-lg mb-2">{agent.name}</h3> 
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
        <div className="mt-4 sm:mt-5">
          {agent.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {agent.description}
            </p>
          )}
          {/* Enhanced stats - responsive layout */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg border border-border/50">
              <MessageSquare className="w-4 h-4 text-primary/70" />
              <span>{agent.conversationCount} conversation{agent.conversationCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg border border-border/50">
              <Clock className="w-4 h-4 text-primary/70" />
              <span>{formatAgentTotalDuration(agent.totalDuration)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4 sm:mt-0 sm:ml-6">
        <Button 
          size="sm" 
          variant="view"
          className="font-semibold w-full sm:w-auto"
          onClick={handleConfigure}
        >
          <ExternalLink className="w-4 h-4" />
          <span className="ml-2 sm:hidden">View</span>
        </Button>
        
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Agent"
          description={
            <span>
              Are you sure you want to delete &ldquo;{agent.name}&rdquo;? This action cannot be undone and will also delete all associated sessions and conversations.
            </span>
          }
          confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          confirmButtonClassName="bg-destructive hover:bg-destructive/90 text-white font-semibold w-full sm:w-auto"
          cancelButtonClassName="w-full sm:w-auto"
        >
          <Button 
            size="sm" 
            className="bg-destructive hover:bg-destructive/90 text-white font-semibold w-full sm:w-auto"
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
            <span className="ml-2 sm:hidden">{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  );
};

export { AgentListItem };