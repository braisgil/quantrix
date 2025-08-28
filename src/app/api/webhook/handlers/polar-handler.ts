/**
 * Polar webhook handler
 */
import { NextRequest, NextResponse } from "next/server";
import { validateEvent } from "@polar-sh/sdk/webhooks";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { creditTransactions } from "@/db/schema";
import { addCredits } from "@/features/credits/server/usage";
import { WebhookResponses } from "./webhook-utils";

interface PolarOrderData {
  id: string;
  productId: string;
  customer: {
    externalId: string | null;
  };
  metadata?: Record<string, unknown>;
  product: {
    metadata?: Record<string, unknown>;
  };
}

/**
 * Handle Polar webhook events
 */
export async function handlePolarWebhook(
  req: NextRequest,
  body: string,
  headers: Record<string, string>
): Promise<NextResponse> {
  try {
    const rawSecret = (process.env.POLAR_WEBHOOK_SECRET || '').trim();
    if (!rawSecret) {
      return WebhookResponses.missingSecret();
    }

    let polarEvent = validateEvent(body, headers, rawSecret);
    
    // If validation failed due to secret format (base64 vs raw), try fallback decode
    if (!polarEvent) {
      const fallbackSecret = (() => {
        try { 
          return Buffer.from(rawSecret, 'base64').toString('utf-8'); 
        } catch { 
          return ''; 
        }
      })();
      
      if (fallbackSecret) {
        polarEvent = validateEvent(body, headers, fallbackSecret);
      }
    }

    if (!polarEvent) {
      return WebhookResponses.invalidSignature();
    }

    if (polarEvent.type === "order.paid") {
      return await handleOrderPaid(polarEvent.data);
    }

    // Unhandled Polar event type
    return WebhookResponses.ignored();
    
  } catch (error) {
    console.error('Polar webhook error:', error);
    return WebhookResponses.invalidSignature();
  }
}

/**
 * Handle order.paid event
 */
async function handleOrderPaid(order: PolarOrderData): Promise<NextResponse> {
  const externalId = order.customer.externalId;
  
  // Extract credits from order or product metadata
  const creditsMeta = (order.metadata as Record<string, unknown> | undefined)?.credits
    ?? (order.product.metadata as Record<string, unknown> | undefined)?.credits
    ?? 0;
    
  const creditGrantRaw = typeof creditsMeta === 'number' ? creditsMeta : Number(creditsMeta);
  const creditGrant = Number.isFinite(creditGrantRaw) ? Math.max(0, Math.floor(creditGrantRaw)) : 0;

  if (!externalId || creditGrant <= 0) {
    console.warn('Invalid order data', { externalId, creditGrant, orderId: order.id });
    return WebhookResponses.ignored();
  }

  try {
    // Check for idempotency - skip if we've already recorded this order
    const existing = await db
      .select({ id: creditTransactions.id })
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.userId, externalId),
          eq(sql`(credit_transactions.metadata->>'orderId')`, order.id),
        ),
      );

    if (existing.length > 0) {
      console.warn('Order already processed', { externalId, orderId: order.id });
      return WebhookResponses.ok();
    }

    // Add credits to user's wallet
    await addCredits(
      externalId, 
      creditGrant, 
      `Credits purchased via Polar order ${order.id}`,
      { orderId: order.id, productId: order.productId },
      "purchase"
    );

    console.warn('Credits granted successfully', { 
      externalId, 
      creditGrant, 
      orderId: order.id 
    });

    return WebhookResponses.ok();

  } catch (error) {
    console.error('Failed to process order.paid event', {
      externalId,
      orderId: order.id,
      error: (error as Error).message,
    });
    
    return WebhookResponses.error("Failed to process order", 500);
  }
}
