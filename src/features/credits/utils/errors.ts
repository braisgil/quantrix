/**
 * Credits system error handling utilities
 */

/**
 * Standardized logging for credits operations
 */
export function logError(
  operation: string,
  error: Error,
  context?: Record<string, unknown>
): void {
  console.error(`Credits ${operation} failed:`, {
    error: error.message,
    stack: error.stack,
    ...context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Standardized logging for credits operations success
 */
export function logSuccess(
  operation: string,
  context?: Record<string, unknown>
): void {
  console.warn(`Credits ${operation} succeeded:`, {
    ...context,
    timestamp: new Date().toISOString(),
  });
}
