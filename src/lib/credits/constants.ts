// Centralized credit monitoring and threshold constants

export const CREDIT_WARNING_THRESHOLD = 35; // Warn when projected available < 35 credits
export const CREDIT_FORCE_TERMINATION_THRESHOLD = 25; // Force end at < 25 credits

// Duration in ms to wait after first critical threshold before forced termination
export const CREDIT_CRITICAL_WINDOW_MS = 3 * 60 * 1000; // 3 minutes


