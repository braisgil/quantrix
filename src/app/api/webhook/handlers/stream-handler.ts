/**
 * Stream webhook handler - coordinates all Stream events
 */
import { NextRequest, NextResponse } from "next/server";
import {
  MessageNewEvent,
  CallEndedEvent,
  CallTranscriptionReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
} from "@stream-io/node-sdk";
import { 
  handleCallSessionStarted,
  handleCallSessionParticipantLeft,
  handleCallSessionEnded,
  handleCallTranscriptionReady,
  handleMessageNew,
} from "./stream-events";
import { WebhookResponses, verifyStreamSignature, parseWebhookPayload } from "./webhook-utils";

/**
 * Handle Stream webhook events
 */
export async function handleStreamWebhook(
  req: NextRequest,
  body: string,
  streamSignature: string
): Promise<NextResponse> {
  // Verify webhook signature
  if (!verifyStreamSignature(body, streamSignature)) {
    return WebhookResponses.invalidSignature();
  }

  // Parse payload
  const payload = parseWebhookPayload(body);
  if (!payload) {
    return WebhookResponses.error("Invalid JSON");
  }

  const eventType = (payload as Record<string, unknown>)?.type;
  console.warn('Processing Stream event type:', eventType);

  try {
    switch (eventType) {
      case "call.session_started":
        return await handleCallSessionStarted(payload as CallSessionStartedEvent);
      
      case "call.session_participant_left":
        return await handleCallSessionParticipantLeft(payload as CallSessionParticipantLeftEvent);
      
      case "call.session_ended":
        return await handleCallSessionEnded(payload as CallEndedEvent);
      
      case "call.transcription_ready":
        return await handleCallTranscriptionReady(payload as CallTranscriptionReadyEvent);
      
      case "message.new":
        return await handleMessageNew(payload as MessageNewEvent);
      
      default:
        console.warn(`Unhandled Stream event type: ${eventType}`);
        return WebhookResponses.ignored();
    }
  } catch (error) {
    console.error(`Failed to handle Stream event ${eventType}:`, error);
    return WebhookResponses.error("Internal server error", 500);
  }
}
