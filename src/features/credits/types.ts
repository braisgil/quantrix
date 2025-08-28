/**
 * Types for the credits system
 */

export type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonValue[] 
  | { [key: string]: JsonValue };

export interface UsageEventData {
  name: string;
  externalCustomerId: string;
  metadata: Record<string, string | number | boolean>;
  timestamp: Date;
}

export type UsageEventName = 
  | "ai_usage"
  | "realtime_api_usage" 
  | "call_usage"
  | "transcription_usage"
  | "chat_message_usage"
  | "inngest_usage";

// UI component types
export interface CreditPackageData {
  id: string;
  credits: number;
  bonusCredits: number;
  totalCredits: number;
  price: number;
  name: string;
  description?: string | null;
  polarProductId?: string;
}
