import { CUSTOM_RULE_OPTIONS } from '@/constants/agent-categories';
import { formatCategoryName } from './category-helpers';

export interface CustomRuleOption {
  name: string;
  description: string;
  category: string;
}

/**
 * Gets custom rule option details by rule ID
 */
export const getCustomRuleOption = (ruleId: string): CustomRuleOption => {
  // Search through all custom rule types to find the matching option
  for (const ruleType of Object.values(CUSTOM_RULE_OPTIONS)) {
    const option = ruleType.options.find(opt => opt.id === ruleId);
    if (option) {
      return {
        name: option.name,
        description: option.description,
        category: ruleType.name
      };
    }
  }
  
  // Fallback to formatted name if not found
  return {
    name: formatCategoryName(ruleId),
    description: '',
    category: ''
  };
};

/**
 * Checks if an agent has any custom rules configured
 */
export const hasCustomRules = (agent: {
  customRule1?: string;
  customRule2?: string;
  additionalRule1?: string | null;
  additionalRule2?: string | null;
}): boolean => {
  return !!(agent.customRule1 || agent.customRule2 || agent.additionalRule1 || agent.additionalRule2);
};

/**
 * Gets all configured custom rules for an agent
 */
export const getAgentCustomRules = (agent: {
  customRule1?: string;
  customRule2?: string;
  additionalRule1?: string | null;
  additionalRule2?: string | null;
}) => {
  const rules: Array<{ type: string; ruleId: string; option: CustomRuleOption }> = [];
  
  if (agent.customRule1) {
    rules.push({
      type: 'Primary Guideline',
      ruleId: agent.customRule1,
      option: getCustomRuleOption(agent.customRule1)
    });
  }
  
  if (agent.customRule2) {
    rules.push({
      type: 'Secondary Guideline',
      ruleId: agent.customRule2,
      option: getCustomRuleOption(agent.customRule2)
    });
  }
  
  if (agent.additionalRule1) {
    rules.push({
      type: 'Additional Rule',
      ruleId: agent.additionalRule1,
      option: {
        name: '',
        description: agent.additionalRule1,
        category: 'Additional Rule'
      }
    });
  }
  
  if (agent.additionalRule2) {
    rules.push({
      type: 'Additional Rule',
      ruleId: agent.additionalRule2,
      option: {
        name: '',
        description: agent.additionalRule2,
        category: 'Additional Rule'
      }
    });
  }
  
  return rules;
};

/**
 * Validates if a custom rule ID exists in the available options
 */
export const isValidCustomRule = (ruleId: string): boolean => {
  for (const ruleType of Object.values(CUSTOM_RULE_OPTIONS)) {
    if (ruleType.options.some(opt => opt.id === ruleId)) {
      return true;
    }
  }
  return false;
};