import { getIconConfig } from '../components/wizard/lib/icon-mappings';
import { formatCategoryName } from './category-helpers';
import type { AgentsGetMany, AgentsGetOne } from '../types';

/**
 * Gets the appropriate icon component for an agent based on its category
 */
export const getAgentIcon = (agent: AgentsGetMany[number] | AgentsGetOne) => {
  const iconConfig = getIconConfig('subcategory', agent.category, agent.name);
  return iconConfig.component;
};

/**
 * Generates a short description for an agent from its instructions or category
 */
export const getAgentDescription = (agent: AgentsGetMany[number] | AgentsGetOne) => {
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
 * Calculates agent statistics for dashboard display
 */
export const calculateAgentStats = (agents: AgentsGetMany) => {
  const activeAgents = agents.length;
  const totalConversations = agents.reduce((sum, agent) => {
    const count = typeof agent.conversationCount === 'string' 
      ? parseInt(agent.conversationCount, 10) 
      : agent.conversationCount;
    return sum + (count || 0);
  }, 0);
  
  const totalDuration = agents.reduce((sum, agent) => {
    const duration = typeof agent.totalDuration === 'string' 
      ? parseFloat(agent.totalDuration) 
      : agent.totalDuration;
    return sum + (duration || 0);
  }, 0);
  const totalDurationFormatted = formatAgentTotalDuration(totalDuration);
  

  return {
    activeAgents,
    totalConversations,
    totalDurationFormatted,
  };
};