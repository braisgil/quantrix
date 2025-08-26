/**
 * Simplified Credit System - Single Export
 * 
 * This file now exports only the simplified credit service.
 * The old complex services (CreditMeteringService, SmartCreditManager, SmartCreditGuard) 
 * have been removed and replaced with a single, simple CreditService.
 */

// Export the unified simple credit service
export { CreditService } from './simple-credit-service';

// Export constants for external usage if needed
export * from './constants';

// System information
console.warn('🚀 Simple Credit System Active - Unified & Simplified');