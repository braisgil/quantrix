// Centralized credit monitoring and threshold constants

export const CREDIT_WARNING_THRESHOLD = 35; // Warn when projected available < 35 credits
export const CREDIT_FORCE_TERMINATION_THRESHOLD = 25; // Force end at < 25 credits

// Duration in ms to wait after first critical threshold before forced termination
export const CREDIT_CRITICAL_WINDOW_MS = 3 * 60 * 1000; // 3 minutes

// Service cost constants (per unit)
export const SERVICE_COSTS = {
  VIDEO_CALL_PER_MINUTE: 0.8, // Cost per minute for video calls
  TRANSCRIPTION_PER_MINUTE: 7.2, // Cost per minute for transcription
  PROCESSING_SIMPLE: 50, // Simple processing cost
  PROCESSING_MEDIUM: 150, // Medium processing cost
  PROCESSING_COMPLEX: 300, // Complex processing cost
} as const;

// Credit allocation constants
export const FREE_CREDIT_ALLOCATION = 500; // Monthly free credit allocation
export const EMERGENCY_CREDIT_BUFFER = 50; // Emergency buffer for critical operations
export const MINIMUM_START_CREDITS = 30; // Minimum credits required to start a call


