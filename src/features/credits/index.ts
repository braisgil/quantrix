// Public API for credits feature - provides clean interface for external consumers

// Main views (most common use case)
export { CreditsView, CreditSuccessView } from './views';

// API hooks for external use
export { useQueryCreditBalance, useQueryCreditBalanceNonSuspense } from './api/use-query-balance';
export { useQueryCreditPackages } from './api/use-query-packages';
export { useQueryCreditTransactions } from './api/use-query-transactions';
export { useQueryCreditUsage, useQueryCreditUsageStats } from './api/use-query-usage';
export { useQueryPurchaseConfirmation } from './api/use-query-purchase-confirmation';
export { useInitiateCreditPurchase, useConfirmCreditPurchase } from './api/use-purchase-credits';
export { useConfirmPurchaseOnce } from './api/use-confirm-purchase';

// Smart credit management
export { useSmartCreditGuard } from './hooks/use-smart-credit-guard';

// Core credit services
export { CreditMeteringService } from '@/lib/credits/metering';
export { SmartCreditManager } from '@/lib/credits/smart-credit-manager';

// Components for external use
export { CreditBalanceCompact, LowCreditBanner } from './components/shared';
export { SmartCreditBanner, SmartCreditIndicator } from './components/smart-credit-banner';
