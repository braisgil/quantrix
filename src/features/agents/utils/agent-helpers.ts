import { getIconConfig } from '../components/wizard/lib/icon-mappings';
import { formatCategoryName } from './category-helpers';
import type { AgentList, AgentItem, AgentDetail } from '../types';

/**
 * Gets the appropriate icon component for an agent based on its category
 */
export const getAgentIcon = (agent: AgentItem | AgentDetail) => {
  const iconConfig = getIconConfig('subcategory', agent.category, agent.name);
  return iconConfig.component;
};

/**
 * Generates a short description for an agent from its instructions or category
 */
export const getAgentDescription = (agent: AgentItem | AgentDetail) => {
  // Try to extract meaningful description from instructions or use category/subcategory
  if (agent.instructions && agent.instructions.length > 0) {
    const description = agent.instructions.substring(0, 60);
    return description.length < agent.instructions.length ? `${description}...` : description;
  }
  return `${formatCategoryName(agent.subcategory)} specialist in ${formatCategoryName(agent.category)}`;
};

/**
 * Formats the total duration of all conversations with an agent
 */
import { formatSeconds } from "@/utils/duration";

export const formatAgentTotalDuration = (totalDurationSeconds: number | string) => {
  return formatSeconds(totalDurationSeconds);
};

/**
 * Safely converts a value to a number, handling string and number inputs
 */
const safeToNumber = (value: unknown): number => {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

/**
 * Calculates agent statistics for dashboard display
 */
export const calculateAgentStats = (agents: AgentList) => {
  const activeAgents = agents.length;
  const totalConversations = agents.reduce((sum, agent) => {
    return sum + safeToNumber(agent.conversationCount);
  }, 0);
  
  const totalDuration = agents.reduce((sum, agent) => {
    return sum + safeToNumber(agent.totalDuration);
  }, 0);
  const totalDurationFormatted = formatAgentTotalDuration(totalDuration);
  

  return {
    activeAgents,
    totalConversations,
    totalDurationFormatted,
  };
};