// Views
export { SessionListView } from "./views/session-list-view";
export { SessionDetailView } from "./views/session-detail-view";

// Components - List View
export { SessionsList } from "./components/list-view/sessions-list";
export { SessionListItem } from "./components/list-view/session-list-item";
export { SessionsListHeader } from "./components/list-view/session-list-header";
export { SessionsEmptyState } from "./components/list-view/sessions-empty-state";

// Components - Detail View
export { 
  SessionHeader,
  SessionDetailsCard,
  SessionConversationsList,
  SessionChatCard,
  SessionActionButtons
} from "./components/detail-view";

// Components - Wizard
export { SessionWizard } from "./components/wizard/components/session-wizard";

// Components - Shared
export { SessionNavigationHeader } from "./components/shared/session-navigation-header";

// API Hooks
export { useQuerySession } from "./api/use-query-session";
export { useQuerySessions } from "./api/use-query-sessions";
export { useSearchSessions } from "./api/use-search-sessions";
export { useQuerySessionConversations } from "./api/use-query-session-conversations";

// Types
export type { 
  Session, 
  SessionStatus,
  SessionGetMany,
  SessionGetOne
} from "./types";

// Schema
export { 
  sessionsInsertSchema, 
  sessionsUpdateSchema,
  type SessionsInsertSchema,
  type SessionsUpdateSchema
} from "./schema";

// Utilities
export {
  getSessionStatusIcon,
  getSessionStatusColor,
  getSessionStatusLabel,
  formatSessionName,
  formatConversationCount,
  canCreateConversation,
  canEditSession,
  canArchiveSession,
  canCompleteSession,
} from "./utils";