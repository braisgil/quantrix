// Public API for conversations feature - provides clean interface for external consumers

// Main views (most common use case)  
export { ConversationDetailView } from './views';

// API hooks for external use
export { useQueryConversation } from './api/use-query-conversation';
export { useQueryConversations } from './api/use-query-conversations';
export { useSearchConversations } from './api/use-search-conversations';

// Public types
export type { ConversationList, ConversationItem, ConversationDetail, ConversationStatus } from './types';

// Server exports for app router
export { conversationRouter } from './server/procedures';
