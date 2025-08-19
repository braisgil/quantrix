// Public API for sessions feature - provides clean interface for external consumers

// Main views (most common use case)
export { SessionListView } from './views/session-list-view';
export { SessionDetailView } from './views/session-detail-view';

// API hooks for external use
export { useQuerySession } from './api/use-query-session';
export { useQuerySessions } from './api/use-query-sessions';
export { useSearchSessions } from './api/use-search-sessions';
export { useDeleteSession } from './api/use-delete-session';
export { useCreateSession } from './api/use-create-session';

// Public types
export type { SessionList, SessionItem, SessionDetail, SessionStatus } from './types';

// Server exports for app router
export { sessionsRouter } from './server/procedures';
