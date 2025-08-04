'use client';

import { Badge } from '@/components/ui/badge';
import { CardHeader } from '@/components/ui/card';
import { Brain, Target, Sparkles } from 'lucide-react';
import { formatCategoryName, getSubSubcategoryName } from '../../utils/category-helpers';

interface AgentHeaderProps {
  agent: {
    name: string;
    category: string;
    subcategory: string;
    subSubcategory: string;
  };
}

export const AgentHeader = ({ agent }: AgentHeaderProps) => {
  return (
    <CardHeader className="text-center pb-0 sm:pb-0">
      {/* Header with Icon and Title */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="relative matrix-glow">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center matrix-border">
            <Brain className="w-4 h-4 text-black" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold quantrix-gradient matrix-text-glow">
          {agent.name}
        </h1>
      </div>
      
      {/* Categories and Badges */}
      <div className="flex flex-wrap gap-2 justify-center mb-2">
        <Badge variant="secondary" className="matrix-border matrix-glow">
          <Brain className="h-3 w-3 mr-1" />
          {formatCategoryName(agent.category)}
        </Badge>
        <Badge variant="outline" className="border-primary/30">
          <Target className="h-3 w-3 mr-1" />
          {formatCategoryName(agent.subcategory)}
        </Badge>
        <Badge variant="outline" className="border-primary/20">
          <Sparkles className="h-3 w-3 mr-1" />
          {getSubSubcategoryName(agent.category, agent.subcategory, agent.subSubcategory)}
        </Badge>
      </div>
    </CardHeader>
  );
}; 