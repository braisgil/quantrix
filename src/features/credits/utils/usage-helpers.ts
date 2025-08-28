/**
 * Usage tracking helpers
 */
import { polarClient } from '@/lib/polar';
import { deductCredits } from '../server/usage';
import { logError, logSuccess } from './errors';
import type { UsageEventName, JsonValue, UsageEventData } from '../types';

/**
 * Ingest usage event to Polar
 */
export async function ingestUsageEvent(
  externalCustomerId: string,
  name: UsageEventName,
  metadata: Record<string, string | number | boolean>
): Promise<boolean> {
  console.warn(`Debug: Attempting to ingest event`, {
    name,
    externalCustomerId,
    metadataKeys: Object.keys(metadata),
    timestamp: new Date().toISOString()
  });
  
  try {
    const eventPayload: { events: UsageEventData[] } = {
      events: [
        {
          name,
          externalCustomerId,
          metadata,
          timestamp: new Date(),
        },
      ],
    };
    
    console.warn(`Debug: Sending to Polar`, {
      eventCount: eventPayload.events.length,
      eventName: name,
      customerId: externalCustomerId
    });
    
    await polarClient.events.ingest(eventPayload);
    
    console.warn(`Debug: Successfully ingested event ${name} for ${externalCustomerId}`);
    return true;
  } catch (error) {
    console.error(`Debug: Polar events.ingest failed for ${name}`, {
      externalCustomerId,
      name,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return false;
  }
}

/**
 * Record usage and deduct credits with error handling
 */
export async function recordUsageAndCharge(params: {
  userId: string;
  creditsToDeduct: number;
  description: string;
  metadata: Record<string, JsonValue>;
  eventName: UsageEventName;
  eventMetadata: Record<string, string | number | boolean>;
}): Promise<void> {
  const { 
    userId, 
    creditsToDeduct, 
    description, 
    metadata, 
    eventName, 
    eventMetadata 
  } = params;

  const context = {
    userId,
    creditsToDeduct,
    eventName,
    description,
  };

  try {
    // Ingest usage event to Polar (non-blocking)
    const ingested = await ingestUsageEvent(userId, eventName, eventMetadata);
    
    if (!ingested) {
      logError('polar-event-ingest', new Error('Failed to ingest usage event'), context);
    }

    // Deduct credits from user's wallet
    await deductCredits(userId, creditsToDeduct, description, metadata);
    
    logSuccess('usage-tracking', context);
    
  } catch (error) {
    if (error instanceof Error) {
      logError('credit-deduction', error, context);
      
      // Parse insufficient credits error for better reporting
      if (error.message.startsWith('INSUFFICIENT_CREDITS')) {
        const [, required, available] = error.message.split(':');
        throw new Error(`Insufficient credits: Required ${required}, Available ${available}`);
      }
    }
    
    // Re-throw to let caller handle the error
    throw error;
  }
}

/**
 * Get environment variable as number with fallback
 */
export function getEnvNumber(
  envKey: string, 
  fallback: number
): number {
  const value = process.env[envKey];
  return value ? Number(value) : fallback;
}

/**
 * Debug logging helper for usage tracking
 */
export function logUsageDebug(
  eventType: string,
  userId: string,
  details: Record<string, unknown>
): void {
  console.warn(`Debug: ${eventType} usage`, {
    userId,
    ...details,
    timestamp: new Date().toISOString(),
  });
}
