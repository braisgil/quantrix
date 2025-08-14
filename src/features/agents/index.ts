// Public API for agents feature - provides clean interface for external consumers

// Main views (most common use case)
export { AgentListView, AgentDetailView } from './views';

// API hooks for external use
export { useQueryAgent } from './api/use-query-agent';
export { useQueryAgents } from './api/use-query-agents';
export { useSearchAgents } from './api/use-search-agents';

// Public types
export type { AgentList, AgentItem, AgentDetail } from './types';

// Server exports for app router
export { agentsRouter } from './server/procedures';
