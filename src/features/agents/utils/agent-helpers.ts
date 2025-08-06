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
export const formatAgentTotalDuration = (totalDurationSeconds: number | string) => {
  // Handle string input and convert to number
  let duration: number;
  
  if (typeof totalDurationSeconds === 'string') {
    // Remove any non-numeric characters except decimal point
    const cleanString = totalDurationSeconds.replace(/[^0-9.]/g, '');
    duration = parseFloat(cleanString);
  } else {
    duration = totalDurationSeconds;
  }
  
  // Check for invalid or zero duration
  if (!duration || isNaN(duration) || duration === 0) return '0s';
  
  // Handle extremely large numbers (likely precision issues)
  if (duration > 999999999) {
    console.warn('Suspiciously large duration value:', totalDurationSeconds, '->', duration);
    return '0s';
  }
  
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Calculates agent statistics for dashboard display
 */
export const calculateAgentStats = (agents: AgentsGetMany) => {
  const activeAgents = agents.length;
  const totalConversations = agents.reduce((sum, agent) => sum + agent.conversationCount, 0);
  const totalDuration = agents.reduce((sum, agent) => sum + agent.totalDuration, 0);
  const totalDurationFormatted = formatAgentTotalDuration(totalDuration);

  return {
    activeAgents,
    totalConversations,
    totalDurationFormatted,
  };
};