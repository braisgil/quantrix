import { agentsRouter } from '@/features/agents/server/procedures';
import { conversationRouter } from '@/features/conversations/server/procedures';
import { sessionsRouter } from '@/features/sessions/server/procedures';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  conversations: conversationRouter,
  sessions: sessionsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
