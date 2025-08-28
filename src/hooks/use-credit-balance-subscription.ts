/**
 * Hook to subscribe to real-time credit balance updates via Stream Chat
 * This listens for credit deduction notifications and triggers balance refetch
 */
import { useEffect, useCallback } from 'react';
import { StreamChat, Channel, Event } from 'stream-chat';
import { useAuthSession } from './use-auth-session';

// Type for credit balance update messages
interface CreditUpdateMessage {
  type: 'credit_balance_update';
  credits_deducted: number;
  new_balance: number;
  reason: string;
  timestamp: number;
  [key: string]: unknown;
}

/**
 * Subscribe to real-time credit balance updates for the current user
 * Returns a function to manually trigger balance refetch
 */
export function useCreditBalanceSubscription(onBalanceUpdate: () => void) {
  const session = useAuthSession();
  const userId = session?.user?.id;

  // Create stream client with user token
  const createStreamClient = useCallback(async (): Promise<{ 
    client: StreamChat | null; 
    channel: Channel | null;
  }> => {
    if (!userId) {
      return { client: null, channel: null };
    }

    try {
      // Initialize Stream Chat client
      const client = StreamChat.getInstance(
        process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!
      );

      // Generate user token for authentication (assuming your app has this endpoint)
      const response = await fetch('/api/stream/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        console.error('Failed to get Stream Chat token');
        return { client: null, channel: null };
      }

      const { token } = await response.json();

      // Connect to Stream Chat
      await client.connectUser(
        { id: userId },
        token
      );

      // Get the credit notifications channel for this user
      const channelId = `credits_${userId}`;
      const channel = client.channel('messaging', channelId, {
        members: [userId],
      });
      
      // Initialize and watch the channel, with proper error handling
      try {
        await channel.watch();
        
        // Ensure the channel is fully initialized before returning
        if (channel.initialized) {
          return { client, channel };
        } else {
          console.error('Channel created but not properly initialized');
          return { client: null, channel: null };
        }
      } catch (error) {
        console.error('Failed to watch credit notifications channel:', error);
        
        // Try to create the channel if it doesn't exist
        try {
          await channel.create();
          await channel.watch();
          return { client, channel };
        } catch (createError) {
          console.error('Failed to create credit notifications channel:', createError);
          return { client: null, channel: null };
        }
      }
    } catch (error) {
      console.error('Failed to setup Stream Chat for credit notifications:', error);
      return { client: null, channel: null };
    }
  }, [userId]);

  useEffect(() => {
    if (!userId || !onBalanceUpdate) {
      return;
    }

    let client: StreamChat | null = null;
    let channel: Channel | null = null;
    let cleanup: (() => void) | null = null;

    const setupSubscription = async () => {
      try {
        const { client: streamClient, channel: streamChannel } = await createStreamClient();
        
        if (!streamClient || !streamChannel) {
          console.warn('Failed to create Stream Chat client or channel');
          return;
        }

        client = streamClient;
        channel = streamChannel;

        // Channel should be initialized at this point, but double-check
        if (!channel.initialized) {
          console.warn('Channel not initialized after creation');
          return;
        }

        // Listen for credit balance update messages
        const handleMessage = (event: Event) => {
          // Only process system messages with credit update format
          if (
            event.type === 'message.new' && 
            event.message?.type === 'system' &&
            event.message?.text?.startsWith('CREDIT_UPDATE:')
          ) {
            try {
              const jsonData = event.message.text.replace('CREDIT_UPDATE:', '');
              const _creditData = JSON.parse(jsonData) as CreditUpdateMessage;
              
              // Trigger balance refetch immediately
              onBalanceUpdate();
            } catch (error) {
              console.error('Failed to parse credit update message:', error);
            }
          }
        };

        // Add event listener only after ensuring channel is ready
        channel.on('message.new', handleMessage);

        // Set up cleanup function
        cleanup = () => {
          if (channel) {
            channel.off('message.new', handleMessage);
          }
          if (client) {
            client.disconnectUser().catch(error => {
              console.error('Error disconnecting Stream Chat user:', error);
            });
          }
        };
      } catch (error) {
        console.error('Error setting up credit balance subscription:', error);
      }
    };

    setupSubscription();

    // Cleanup on unmount or dependency change
    return () => {
      cleanup?.();
    };
  }, [userId, onBalanceUpdate, createStreamClient]);

  // Return manual trigger function in case it's needed
  return useCallback(() => {
    onBalanceUpdate();
  }, [onBalanceUpdate]);
}

// Stream Chat token endpoint is handled internally
