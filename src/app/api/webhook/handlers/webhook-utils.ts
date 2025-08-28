/**
 * Webhook utility functions
 */
import { NextResponse } from "next/server";
import { streamVideo } from "@/lib/stream-video";

// Simple in-memory cache to prevent duplicate message processing
// In production, consider using Redis
const processedMessages = new Set<string>();
const PROCESSED_MESSAGES_MAX_SIZE = 10000;

/**
 * Verify Stream webhook signature
 */
export function verifyStreamSignature(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
}

/**
 * Check if message has already been processed (deduplication)
 */
export function isMessageProcessed(messageId: string): boolean {
  return processedMessages.has(messageId);
}

/**
 * Mark message as processed and manage memory
 */
export function markMessageAsProcessed(messageId: string): void {
  processedMessages.add(messageId);
  
  // Clean up processed messages set to prevent memory leaks
  if (processedMessages.size > PROCESSED_MESSAGES_MAX_SIZE) {
    const messagesArray = Array.from(processedMessages);
    processedMessages.clear();
    messagesArray.slice(Math.floor(messagesArray.length / 2)).forEach(id => {
      processedMessages.add(id);
    });
  }
}

/**
 * Standard webhook response helpers
 */
export const WebhookResponses = {
  ok: () => NextResponse.json({ status: "ok" }),
  ignored: () => NextResponse.json({ status: "ignored" }),
  duplicateIgnored: () => NextResponse.json({ status: "duplicate_ignored" }),
  error: (message: string, status = 400) => NextResponse.json({ error: message }, { status }),
  invalidSignature: () => NextResponse.json({ error: "Invalid signature" }, { status: 401 }),
  missingSecret: () => NextResponse.json({ error: "Missing webhook secret" }, { status: 500 }),
} as const;

/**
 * Parse JSON with error handling
 */
export function parseWebhookPayload(body: string): unknown | null {
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}
