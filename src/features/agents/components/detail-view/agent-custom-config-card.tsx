'use client';

import { Settings } from 'lucide-react';
import { hasCustomRules, getAgentCustomRules } from '../../utils/custom-rule-helpers';

interface AgentCustomConfigCardProps {
  agent: {
    customRule1?: string;
    customRule2?: string;
    additionalRule1?: string | null;
    additionalRule2?: string | null;
  };
}

export const AgentCustomConfigCard = ({ agent }: AgentCustomConfigCardProps) => {
  const agentHasCustomRules = hasCustomRules(agent);

  if (!agentHasCustomRules) {
    return null;
  }

  const customRules = getAgentCustomRules(agent);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <Settings className="w-4 h-4 text-primary" />
        <h4 className="text-lg font-bold quantrix-gradient matrix-text-glow">Custom Configuration</h4>
      </div>
      <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {customRules.map((rule, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <div>
                  <span className="font-medium text-foreground">{rule.type}:</span>
                  <span className="text-primary font-medium ml-1">{rule.option.name}</span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-4 text-xs">
                {rule.option.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 