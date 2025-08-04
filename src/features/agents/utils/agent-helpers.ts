import { getIconConfig } from '../components/wizard/lib/icon-mappings';
import type { Agent } from '../types';

/**
 * Gets the appropriate icon component for an agent based on its category
 */
export const getAgentIcon = (agent: Agent) => {
  const iconConfig = getIconConfig('subcategory', agent.category, agent.name);
  return iconConfig.component;
};

/**
 * Generates a short description for an agent from its instructions or category
 */
export const getAgentDescription = (agent: Agent) => {
  // Try to extract meaningful description from instructions or use category/subcategory
  if (agent.instructions && agent.instructions.length > 0) {
    const description = agent.instructions.substring(0, 60);
    return description.length < agent.instructions.length ? `${description}...` : description;
  }
  return `${agent.subcategory} specialist in ${agent.category}`;
};

/**
 * Formats a dash-separated category name to proper case
 */
export const formatCategoryName = (category: string) => {
  return category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

/**
 * Calculates agent statistics for dashboard display
 */
export const calculateAgentStats = (agents: Agent[]) => {
  const activeAgents = agents.length; // For now, consider all agents as active
  const totalSessions = agents.length * 15; // Mock calculation - could be enhanced with real data
  const totalUptime = "99.9%"; // Mock uptime - could be calculated from real metrics

  return {
    activeAgents,
    totalSessions,
    totalUptime,
  };
};