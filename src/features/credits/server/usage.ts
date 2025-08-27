import { db } from "@/db";
import { creditTransactions, creditsWallets } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import { and, eq, sql } from "drizzle-orm";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export async function ensureWallet(userId: string) {
  const [wallet] = await db
    .select()
    .from(creditsWallets)
    .where(eq(creditsWallets.userId, userId));
  if (!wallet) {
    await db.insert(creditsWallets).values({ userId, balance: 0 });
  }
}

export async function addCredits(userId: string, amount: number, description?: string, metadata?: Record<string, JsonValue>) {
  if (amount <= 0) return;
  // Atomic upsert + increment to avoid transactions on serverless drivers
  await db
    .insert(creditsWallets)
    .values({ userId, balance: amount })
    .onConflictDoUpdate({
      target: creditsWallets.userId,
      set: {
        balance: sql`${creditsWallets.balance} + ${amount}`,
        updatedAt: new Date(),
      },
    });

  await db.insert(creditTransactions).values({
    userId,
    amount,
    type: "adjustment",
    description: description ?? "Manual credit grant",
    metadata: metadata as unknown,
  });
}

export async function deductCredits(userId: string, amount: number, description?: string, metadata?: Record<string, JsonValue>) {
  const deduct = Math.abs(amount);
  // Conditional decrement to avoid negative balances; returns updated rows
  const updated = await db
    .update(creditsWallets)
    .set({
      balance: sql`${creditsWallets.balance} - ${deduct}`,
      updatedAt: new Date(),
    })
    .where(and(eq(creditsWallets.userId, userId), sql`${creditsWallets.balance} >= ${deduct}`))
    .returning({ balance: creditsWallets.balance });

  if (updated.length === 0) {
    throw new Error("INSUFFICIENT_CREDITS");
  }

  await db.insert(creditTransactions).values({
    userId,
    amount: -deduct,
    type: "usage",
    description: description ?? "Usage deduction",
    metadata: metadata as unknown,
  });
}

export async function ingestUsageEvent(
  externalCustomerId: string,
  name: string,
  metadata: Record<string, string | number | boolean>,
) {
  try {
    await polarClient.events.ingest({
      events: [
        {
          name,
          externalCustomerId,
          metadata,
          timestamp: new Date(),
        },
      ],
    });
    return true;
  } catch (error) {
    console.error('Polar events.ingest failed', error);
    return false;
  }
}

export async function recordAiUsageAndCharge(params: {
  userId: string;
  totalTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
  model?: string;
  creditsPerKTokens?: number; // default 1 credit / 1k tokens
  minimumCredits?: number; // default minimum 1 credit per call
}) {
  const {
    userId,
    totalTokens = 0,
    promptTokens = 0,
    completionTokens = 0,
    model = "unknown",
    creditsPerKTokens = Number(process.env.CREDITS_PER_K_TOKENS ?? 1),
    minimumCredits = Number(process.env.MIN_CREDITS_PER_CALL ?? 1),
  } = params;

  const variable = Math.ceil((totalTokens / 1000) * creditsPerKTokens);
  const creditsToDeduct = Math.max(minimumCredits, variable);

  console.warn('Debug: ai_usage about to ingest', {
    userId,
    model,
    totalTokens,
    promptTokens,
    completionTokens,
    creditsPerKTokens,
    minimumCredits,
    creditsToDeduct,
  });

  const ingested = await ingestUsageEvent(userId, "ai_usage", {
    model,
    total_tokens: totalTokens,
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
    credits_charged: creditsToDeduct,
  });

  if (!ingested) {
    console.warn('Debug: Polar ingestUsageEvent failed', {
      userId,
      name: 'ai_usage',
    });
  }

  try {
    await deductCredits(userId, creditsToDeduct, "AI usage", {
      model,
      totalTokens,
      promptTokens,
      completionTokens,
    });
  } catch (error) {
    console.error('Debug: deductCredits failed', {
      userId,
      creditsToDeduct,
      error: (error as Error).message,
    });
  }
}


