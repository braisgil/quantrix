# Credit-Based Subscription System

## Overview

This document describes the implementation of a simplified prepaid credit system. Users purchase credits upfront through Polar.sh, and these credits are deducted immediately when they use OpenAI and GetStream.io services. The system provides real-time balance tracking and UI-based low credit warnings.

## Architecture

### Key Components

1. **Credit Metering Service** (`src/lib/credits/metering.ts`)
   - Manages credit balances with immediate deduction
   - Tracks usage events for history and analytics
   - Calculates costs dynamically based on service pricing

2. **Usage Trackers** (`src/lib/credits/usage-tracker.ts`)
   - OpenAI usage tracking (GPT-4o, GPT-4o Mini)  
   - GetStream.io usage tracking (video calls, chat, transcription)
   - Provides cost estimation before expensive operations

3. **Database Schema**
   - `credit_balances`: User credit balances
   - `credit_transactions`: Purchase and usage history
   - `usage_events`: Detailed usage tracking for analytics
   - `service_pricing`: Dynamic pricing configuration
   - `credit_packages`: Available credit packages

4. **UI Components** (`src/features/credits/components/`)
   - Real-time credit balance display with low balance warnings
   - Credit purchase flow integration with Polar.sh
   - Usage analytics and transaction history

5. **Background Jobs** (Inngest functions)
   - Conversation processing and summarization (uses credits)

## Setup Instructions

### 1. Environment Variables

Add these to your `.env.local`:

```env
# Existing variables...
POLAR_ACCESS_TOKEN=your_polar_access_token
OPENAI_API_KEY=your_openai_api_key
STREAM_VIDEO_API_KEY=your_stream_video_api_key
STREAM_VIDEO_SECRET_KEY=your_stream_video_secret_key
STREAM_CHAT_API_KEY=your_stream_chat_api_key
STREAM_CHAT_SECRET_KEY=your_stream_chat_secret_key
```

### 2. Database Migration

Run the migration to create credit-related tables:

```bash
npm run db:migrate:credits
```

Or use Drizzle Kit:

```bash
npm run db:push
```

### 3. Configure Polar.sh Products

1. Log into your Polar.sh dashboard
2. Create credit packages as products:
   - Starter Pack: $10 for 1,000 credits
   - Growth Pack: $40 for 5,000 + 1,000 bonus credits
   - Pro Pack: $75 for 10,000 + 2,500 bonus credits
   - Enterprise Pack: $350 for 50,000 + 15,000 bonus credits

3. Update the `credit_packages` table with actual Polar product IDs:

```sql
UPDATE credit_packages 
SET polar_product_id = 'actual_polar_product_id' 
WHERE name = 'Starter Pack';
-- Repeat for other packages
```

### 4. Start Background Jobs

Start the Inngest dev server to process background jobs:

```bash
npm run dev:inngest
```

## Pricing Model

### Profit Margin
- Default: 20% profit margin
- User pays $1 → receives 800 credits (80% of value)
- 1 credit = $0.001 after margin

### Service Pricing (Dynamic)

| Service | Unit | Base Cost | Credits per Unit |
|---------|------|-----------|------------------|
| GPT-4o | Per million tokens | $2.50 input / $10 output | ~3,125 / ~12,500 |
| GPT-4o Mini | Per million tokens | $0.15 input / $0.60 output | ~188 / ~750 |
| Video Calls | Per minute | $0.004 | ~5 |
| Chat Messages | Per message | $0.0002 | ~0.16 |
| Transcription | Per minute | $0.006 | ~7.5 |

## Usage Tracking

### OpenAI Usage

The system automatically tracks:
- Token consumption for each API call
- Model used (GPT-4o or GPT-4o Mini)
- Associated conversation/session
- Input and output tokens separately

### GetStream.io Usage

The system tracks:
- Video call duration (rounded up to nearest minute)
- Chat messages sent
- Transcription duration

### Webhook Integration

Usage is tracked through webhook events:
- `call.session_ended`: Track video call duration
- `call.transcription_ready`: Track transcription usage
- `message.new`: Track chat message usage

## API Endpoints

### tRPC Procedures

```typescript
// Get user's credit balance
const balance = await trpc.credits.getBalance.query();

// Get available credit packages
const packages = await trpc.credits.getCreditPackages.query();

// Initiate credit purchase
const { checkoutUrl } = await trpc.credits.initiateCreditPurchase.mutate({
  packageId: "package_id"
});

// Get transaction history
const transactions = await trpc.credits.getTransactionHistory.query({
  limit: 50,
  offset: 0,
  type: "purchase" // or "usage", "refund", etc.
});

// Get usage statistics
const stats = await trpc.credits.getUsageStats.query({
  period: "month" // or "day", "week", "all"
});

// Estimate cost for operations
const estimate = await trpc.credits.estimateCost.query({
  operations: [
    {
      type: "openai",
      model: "gpt-4o",
      estimatedInputTokens: 1000,
      estimatedOutputTokens: 500
    }
  ]
});
```

## UI Components

### Credit Balance Display
- **Navbar**: Compact credit balance display
- **Credits Page**: Full dashboard with balance, usage charts, and purchase options
- **Low Balance Alerts**: Visual warnings when credits < 100

### Credit Purchase Flow
1. User navigates to `/credits`
2. Selects a credit package
3. Redirected to Polar.sh checkout
4. Returns to `/credits/success`
5. Credits automatically added to balance

## Testing the System

### 1. Test Credit Purchase

```bash
# Navigate to /credits in your app
# Select a package and complete checkout
# Verify credits are added to balance
```

### 2. Test Usage Tracking

```typescript
// Test OpenAI usage
const response = await openaiClient.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }]
});

// Check usage was tracked
const usage = await trpc.credits.getUsageHistory.query({
  service: "openai_gpt4o"
});
```

### 3. Test Background Jobs

```bash
# Trigger manual processing
curl -X POST http://localhost:8288/e/credits/process-usage-events

# Check reconciliation
curl -X POST http://localhost:8288/e/credits/reconcile-balances
```

## Monitoring

### Key Metrics
- Total credits purchased vs. used
- Usage by service type
- Average credit consumption per user
- Low balance alert frequency

### Database Queries

```sql
-- Check user balance
SELECT * FROM credit_balances WHERE user_id = 'user_id';

-- Recent transactions
SELECT * FROM credit_transactions 
WHERE user_id = 'user_id' 
ORDER BY created_at DESC 
LIMIT 10;

-- Usage by service
SELECT service, SUM(total_cost::numeric) as total 
FROM usage_events 
WHERE user_id = 'user_id' 
GROUP BY service;
```

## Low Credit Warnings

The system provides real-time low credit warnings through the UI instead of background notifications:

### Components

1. **CreditBalanceCompact**: Shows warning icon and red text when credits < 100
2. **CreditBalanceCard**: Displays "Low balance" badge when credits < 100  
3. **LowCreditBanner**: Prominent banner that appears when credits are low
4. **useCreditGuard Hook**: Utility hook for checking credit availability

### Usage Examples

```tsx
import { LowCreditBanner, useCreditGuard } from "@/features/credits";

// Show banner when credits are low
<LowCreditBanner 
  threshold={100} 
  onPurchaseClick={() => router.push('/credits')} 
/>

// Check credits before expensive operations
const { canAfford, shouldWarn, estimateOpenAICost } = useCreditGuard();

// Estimate cost before making API call
const estimate = await estimateOpenAICost({
  model: "gpt-4o",
  estimatedInputTokens: 1000,
  estimatedOutputTokens: 500,
});

if (!estimate.canAfford) {
  // Show purchase modal or disable feature
}
```

## Troubleshooting

### Common Issues

1. **Credits not deducted**: Check if usage events are being created and credit balance is updated
2. **Polar checkout fails**: Verify Polar API keys and product IDs
3. **Conversation processing fails**: Ensure Inngest is running (`npm run dev:inngest`)
4. **Insufficient credits error**: User needs to purchase more credits

### Debug Mode

Enable detailed logging:

```typescript
// In metering.ts
console.log("Credit calculation:", {
  service,
  quantity,
  cost: creditCost.toString()
});
```

## Security Considerations

1. **Webhook Verification**: All webhooks are verified using signatures
2. **Immediate Deduction**: Credits are deducted immediately when services are used
3. **Transaction History**: All credit operations create audit trail records
4. **Rate Limiting**: API calls are rate-limited per user

## Future Enhancements

- [ ] Credit expiration policies
- [ ] Bulk credit discounts
- [ ] Team/organization credit pools
- [ ] Credit transfer between users
- [ ] Detailed usage analytics dashboard
- [ ] Predictive credit consumption alerts
- [ ] API for external credit management

