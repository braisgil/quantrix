// Main feature exports - provides clean public API for agents feature

// Core types
export type { Agent } from './types';

// API hooks
export { useQueryAgent } from './api/use-query-agent';
export { useQueryAgents } from './api/use-query-agents';

// Main view components
export { AgentListView, AgentDetailView } from './views';

// Individual components for custom layouts
export {
  // Stats
  AgentStatsCards,
  
  // List view
  AgentsList,
  AgentsListHeader,
  AgentListItem,
  AgentsEmptyState,
  
  // Detail view
  AgentHeader,
  AgentDetailsCard,
  AgentSpecializationCard,
  AgentCustomConfigCard,
  AgentActionButtons,
  
  // Shared utilities
  AgentSkeleton,
  ErrorBoundary,
  AgentNavigationHeader,
  
  // Types
  type AgentSkeletonVariant,
} from './components';

// Utility functions
export {
  // Agent helpers
  getAgentIcon,
  getAgentDescription,
  calculateAgentStats,
  
  // Category helpers
  formatCategoryName,
  getCategoryDescription,
  getSubcategoryDescription,
  getSubSubcategoryName,
  getSubcategoryNames,
  isValidCategory,
  isValidSubcategory,
  
  // Custom rule helpers
  getCustomRuleOption,
  hasCustomRules,
  getAgentCustomRules,
  isValidCustomRule,
  
  // Types
  type CustomRuleOption,
} from './utils';

// Server-side exports (for app router)
export { agentsRouter } from './server/procedures';