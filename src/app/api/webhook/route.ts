import { NextRequest } from "next/server";
import { handlePolarWebhook, handleStreamWebhook } from "./handlers";
import { WebhookResponses } from "./handlers/webhook-utils";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersObj = Object.fromEntries(req.headers);
  
  // Determine webhook type and route to appropriate handler
  const hasPolarSignature = Boolean(headersObj['webhook-signature']);
  const streamSignature = req.headers.get("x-signature");

  if (hasPolarSignature) {
    return await handlePolarWebhook(req, body, headersObj);
  }

  if (streamSignature) {
    return await handleStreamWebhook(req, body, streamSignature);
  }

  // No valid signature found
  return WebhookResponses.invalidSignature();
}
