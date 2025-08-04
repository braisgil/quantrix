'use client';

import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { 
  formatCategoryName, 
  getCategoryDescription, 
  getSubcategoryDescription, 
  getSubSubcategoryName 
} from '../../utils/category-helpers';

interface AgentSpecializationCardProps {
  agent: {
    category: string;
    subcategory: string;
    subSubcategory: string;
  };
}

export const AgentSpecializationCard = ({ agent }: AgentSpecializationCardProps) => {
  return (
    <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
      <div className="flex items-center mb-3">
        <Sparkles className="w-4 h-4 text-primary mr-2" />
        <h4 className="font-semibold text-primary">Specialization</h4>
      </div>
      <div className="space-y-4 text-sm">
        <div>
          <div className="flex items-start gap-2 mb-1">
            <span className="text-primary mt-0.5">→</span>
            <div>
              <span className="font-medium text-foreground">Primary Focus:</span> <span className="text-primary font-medium">{formatCategoryName(agent.category)}</span>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed pl-4 text-xs">
            {getCategoryDescription(agent.category)}
          </p>
        </div>

        <div>
          <div className="flex items-start gap-2 mb-1">
            <span className="text-primary mt-0.5">→</span>
            <div>
              <span className="font-medium text-foreground">Area:</span> <span className="text-primary font-medium">{formatCategoryName(agent.subcategory)}</span>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed pl-4 text-xs">
            {getSubcategoryDescription(agent.category, agent.subcategory)}
          </p>
        </div>

        <div>
          <div className="flex items-start gap-2 mb-1">
            <span className="text-primary mt-0.5">→</span>
            <div>
              <span className="font-medium text-foreground mr-2">Expertise: </span>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                <Sparkles className="h-3 w-3 mr-1" />
                {getSubSubcategoryName(agent.category, agent.subcategory, agent.subSubcategory)}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 