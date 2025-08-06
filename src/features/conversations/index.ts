// Main feature exports - provides clean public API for conversations feature

// Core types
export type { ConversationGetMany, ConversationGetOne, ConversationStatus, StreamTranscriptItem } from './types';

// API hooks
export { useQueryConversation } from './api/use-query-conversation';
export { useQueryConversations } from './api/use-query-conversations';
export { useSearchConversations } from './api/use-search-conversations';

// Note: Conversation wizard is now strictly session-scoped and managed within session contexts

// Main view components
export { ConversationListView, ConversationDetailView } from './views';

// Wizard components
export { ConversationWizard } from './components/wizard';

// Individual components for custom layouts
export {
  // Stats
  ConversationsStatsCards,
  
  // List view
  ConversationsList,
  ConversationsListHeader,
  ConversationListItem,
  ConversationsEmptyState,
  
  // Detail view
  ConversationHeader,
  ConversationDetailsCard,
  ConversationSummaryCard,
  ConversationActionButtons,
  
  // Shared utilities
  ConversationSkeleton,
  ErrorBoundary,
  ConversationNavigationHeader,
  
  // Types
  type ConversationSkeletonVariant,
} from './components';

// Utility functions
export {
  // Conversation helpers
  getConversationIcon,
  getConversationStatusLabel,
  getConversationStatusColor,
  formatConversationDuration,
  calculateConversationStats,
} from './utils';

// Server-side exports (for app router)
export { conversationRouter } from './server/procedures'; 