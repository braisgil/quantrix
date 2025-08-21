import { agentsRouter } from '@/features/agents/server/procedures';
import { conversationRouter } from '@/features/conversations/server/procedures';
import { sessionsRouter } from '@/features/sessions/server/procedures';
import { premiumRouter } from '@/features/premium/server/procedures';
import { creditsRouter } from '@/features/credits/server/procedures';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  conversations: conversationRouter,
  sessions: sessionsRouter,
  premium: premiumRouter,
  credits: creditsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
