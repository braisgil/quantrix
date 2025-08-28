/**
 * Server-side tRPC client for webhook handlers
 * This allows webhooks to call tRPC mutations for credit deduction
 */
import { createCallerFactory } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';

// Create the server-side caller factory
const createCaller = createCallerFactory(appRouter);

/**
 * Create a tRPC caller for webhook use
 * This creates a context without requiring authentication since webhooks run server-side
 */
export async function createWebhookCaller() {
  // Create a minimal context for webhook calls
  const ctx = {
    session: null, // Webhooks don't have user sessions
    db: (await import('@/db')).db, // Import db directly
  };
  
  return createCaller(ctx);
}

/**
 * Create a webhook credits client - simplified approach
 * Returns the tRPC caller directly since notification logic is now in procedures
 */
export async function createWebhookCreditsClient() {
  return await createWebhookCaller();
}
