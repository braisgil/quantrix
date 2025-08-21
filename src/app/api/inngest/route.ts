import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { conversationsProcessing } from "@/inngest/functions";
import { 
  processUsageEvents, 
  reconcileCreditBalances, 
  alertLowCreditBalance 
} from "@/inngest/functions/credit-processing";

// Create an API that serves the functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    conversationsProcessing,
    processUsageEvents,
    reconcileCreditBalances,
    alertLowCreditBalance,
  ],
});
