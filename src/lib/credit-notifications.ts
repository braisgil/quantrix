/**
 * Real-time credit balance notification system using Stream Chat
 * This allows webhooks to immediately notify clients when credits are deducted
 */
import { streamChat } from '@/lib/stream-chat';

/**
 * Send a credit balance update notification to a user
 * This creates/updates a system channel for the user and sends a notification message
 */
export async function sendCreditBalanceUpdate(
  userId: string,
  params: {
    creditsDeducted: number;
    newBalance: number;
    reason: string;
    metadata?: Record<string, unknown>;
  }
) {
  try {
    const { creditsDeducted, newBalance, reason, metadata = {} } = params;
    
    // Create/get a system channel for this user's credit notifications
    const channelId = `credits_${userId}`;
    const channel = streamChat.channel('messaging', channelId, {
      members: [userId], // Only the user is a member
      created_by_id: 'system', // System-created channel
    });

    // Ensure the channel exists and is properly initialized
    try {
      await channel.watch();
    } catch (error) {
      // If watch fails, try to create the channel first
      console.warn('Channel watch failed, attempting to create channel:', error);
      try {
        await channel.create();
        await channel.watch();
      } catch (createError) {
        console.error('Failed to create and watch channel:', createError);
        throw createError;
      }
    }

    // Send the credit update notification with encoded data in text
    const creditUpdateData = {
      type: 'credit_balance_update',
      credits_deducted: creditsDeducted,
      new_balance: newBalance,
      reason,
      timestamp: Date.now(),
      ...metadata,
    };
    
    await channel.sendMessage({
      type: 'system',
      text: `CREDIT_UPDATE:${JSON.stringify(creditUpdateData)}`,
      user: { id: 'system', name: 'System' },
    });

    console.log(`Sent credit balance notification to user ${userId}: -${creditsDeducted} credits`);
    return true;
  } catch (error) {
    console.error(`Failed to send credit balance notification to user ${userId}:`, error);
    return false;
  }
}

/**
 * Get the current balance from the database
 * Helper function for webhooks to get the updated balance after deduction
 */
export async function getCurrentBalance(userId: string): Promise<number> {
  try {
    const { db } = await import('@/db');
    const { creditsWallets } = await import('@/db/schema');
    const { eq } = await import('drizzle-orm');
    
    const [wallet] = await db
      .select({ balance: creditsWallets.balance })
      .from(creditsWallets)
      .where(eq(creditsWallets.userId, userId));
      
    return wallet?.balance ?? 0;
  } catch (error) {
    console.error(`Failed to get current balance for user ${userId}:`, error);
    return 0;
  }
}

/**
 * Notification types for different credit deduction reasons
 */
export const CREDIT_DEDUCTION_REASONS = {
  AI_USAGE: 'AI model usage',
  CALL_USAGE: 'Video call usage', 
  CHAT_MESSAGE: 'Chat message',
  REALTIME_API: 'Real-time API usage',
  TRANSCRIPTION: 'Call transcription',
  INNGEST: 'Background processing',
} as const;

export type CreditDeductionReason = typeof CREDIT_DEDUCTION_REASONS[keyof typeof CREDIT_DEDUCTION_REASONS];
