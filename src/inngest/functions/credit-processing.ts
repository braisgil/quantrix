import { inngest } from "@/inngest/client";
import { db } from "@/db";
import { usageEvents, creditBalances, creditTransactions } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { CreditMeteringService } from "@/lib/credits/metering";
import Decimal from "decimal.js";

/**
 * Process pending usage events in batches
 */
export const processUsageEvents = inngest.createFunction(
  { 
    id: "credits/process-usage-events",
    concurrency: {
      limit: 1, // Process one at a time to avoid race conditions
    },
  },
  { cron: "*/5 * * * *" }, // Run every 5 minutes
  async ({ step }) => {
    // Get unprocessed usage events
    const pendingEvents = await step.run("fetch-pending-events", async () => {
      return await db
        .select()
        .from(usageEvents)
        .where(and(eq(usageEvents.processed, false), isNull(usageEvents.polarEventId)))
        .limit(100); // Process in batches of 100
    });

    if (pendingEvents.length === 0) {
      return { processed: 0 };
    }

    // Group events by user for batch processing
    const eventsByUser = pendingEvents.reduce((acc, event) => {
      if (!acc[event.userId]) {
        acc[event.userId] = [];
      }
      acc[event.userId].push(event);
      return acc;
    }, {} as Record<string, typeof pendingEvents>);

    let totalProcessed = 0;

    // Process events for each user
    for (const [userId, userEvents] of Object.entries(eventsByUser)) {
      await step.run(`process-user-${userId}`, async () => {
        for (const event of userEvents) {
          try {
            // Send to Polar metering
            await CreditMeteringService.sendPolarMeteringEvent({
              customerId: userId,
              eventName: `usage.${event.service}`,
              properties: {
                eventId: event.id,
                quantity: new Decimal(event.quantity).toNumber(),
                creditCost: new Decimal(event.totalCost).toNumber(),
                resourceId: event.resourceId || undefined,
                resourceType: event.resourceType || undefined,
                metadata: event.metadata ? JSON.parse(event.metadata) : undefined,
              },
            });

            // Mark as processed
            await db
              .update(usageEvents)
              .set({
                processed: true,
                processedAt: new Date(),
                polarEventId: `polar_${event.id}_${Date.now()}`, // Generate a unique ID
              })
              .where(eq(usageEvents.id, event.id));

            totalProcessed++;
          } catch (error) {
            console.error(`Failed to process usage event ${event.id}:`, error);
          }
        }
      });
    }

    return { processed: totalProcessed };
  }
);

/**
 * Reconcile credit balances daily
 */
export const reconcileCreditBalances = inngest.createFunction(
  { 
    id: "credits/reconcile-balances",
    concurrency: {
      limit: 1,
    },
  },
  { cron: "0 0 * * *" }, // Run daily at midnight
  async ({ step }) => {
    // Get all users with credit balances
    const balances = await step.run("fetch-balances", async () => {
      return await db.select().from(creditBalances);
    });

    const reconciliationResults = [];

    for (const balance of balances) {
      const result = await step.run(`reconcile-user-${balance.userId}`, async () => {
        // Calculate actual totals from transactions
        const transactions = await db
          .select()
          .from(creditTransactions)
          .where(eq(creditTransactions.userId, balance.userId));

        const actualTotalPurchased = transactions
          .filter(tx => tx.type === "purchase")
          .reduce((sum, tx) => sum.plus(new Decimal(tx.amount)), new Decimal(0));

        const actualTotalUsed = transactions
          .filter(tx => tx.type === "usage")
          .reduce((sum, tx) => sum.plus(new Decimal(tx.amount).abs()), new Decimal(0));

        const calculatedAvailable = actualTotalPurchased.minus(actualTotalUsed);

        const currentAvailable = new Decimal(balance.availableCredits);
        const currentTotalPurchased = new Decimal(balance.totalPurchased);
        const currentTotalUsed = new Decimal(balance.totalUsed);

        // Check for discrepancies
        const availableDiff = calculatedAvailable.minus(currentAvailable);
        const purchasedDiff = actualTotalPurchased.minus(currentTotalPurchased);
        const usedDiff = actualTotalUsed.minus(currentTotalUsed);

        const hasDiscrepancy = 
          availableDiff.abs().greaterThan(0.01) ||
          purchasedDiff.abs().greaterThan(0.01) ||
          usedDiff.abs().greaterThan(0.01);

        if (hasDiscrepancy) {
          // Log discrepancy for manual review
          console.warn(`Credit balance discrepancy for user ${balance.userId}:`, {
            availableDiff: availableDiff.toFixed(6),
            purchasedDiff: purchasedDiff.toFixed(6),
            usedDiff: usedDiff.toFixed(6),
          });

          // Create adjustment transaction if needed
          if (availableDiff.abs().greaterThan(0.01)) {
            await db.insert(creditTransactions).values({
              userId: balance.userId,
              type: "adjustment",
              amount: availableDiff.toFixed(6),
              balanceBefore: currentAvailable.toFixed(6),
              balanceAfter: calculatedAvailable.toFixed(6),
              description: "Automatic balance reconciliation",
              metadata: JSON.stringify({
                reason: "reconciliation",
                previousAvailable: currentAvailable.toFixed(6),
                calculatedAvailable: calculatedAvailable.toFixed(6),
                difference: availableDiff.toFixed(6),
              }),
            });

            // Update balance
            await db
              .update(creditBalances)
              .set({
                availableCredits: calculatedAvailable.toFixed(6),
                totalPurchased: actualTotalPurchased.toFixed(6),
                totalUsed: actualTotalUsed.toFixed(6),
                updatedAt: new Date(),
              })
              .where(eq(creditBalances.userId, balance.userId));
          }
        }

        return {
          userId: balance.userId,
          hasDiscrepancy,
          adjustmentMade: hasDiscrepancy && availableDiff.abs().greaterThan(0.01),
        };
      });

      reconciliationResults.push(result);
    }

    return {
      totalChecked: balances.length,
      discrepanciesFound: reconciliationResults.filter(r => r.hasDiscrepancy).length,
      adjustmentsMade: reconciliationResults.filter(r => r.adjustmentMade).length,
    };
  }
);

/**
 * Alert users when credits are running low
 */
export const alertLowCreditBalance = inngest.createFunction(
  { 
    id: "credits/alert-low-balance",
    concurrency: {
      limit: 5,
    },
  },
  { cron: "0 */6 * * *" }, // Run every 6 hours
  async ({ step }) => {
    const lowBalanceThreshold = 100; // Alert when below 100 credits

    const lowBalances = await step.run("fetch-low-balances", async () => {
      const balances = await db.select().from(creditBalances);
      return balances.filter(b => new Decimal(b.availableCredits).lessThan(lowBalanceThreshold));
    });

    const alertsSent: string[] = [];

    for (const balance of lowBalances) {
      await step.run(`alert-user-${balance.userId}`, async () => {
        // Here you would implement actual notification logic
        // For example: send email, in-app notification, etc.
        console.warn(`Low credit alert for user ${balance.userId}: ${balance.availableCredits} credits remaining`);
        
        // You could integrate with your notification system here
        // await notificationService.send({
        //   userId: balance.userId,
        //   type: "low_credits",
        //   data: {
        //     availableCredits: balance.availableCredits,
        //     threshold: lowBalanceThreshold,
        //   }
        // });

        alertsSent.push(balance.userId);
      });
    }

    return {
      usersAlerted: alertsSent.length,
      users: alertsSent,
    };
  }
);
