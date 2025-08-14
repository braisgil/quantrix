/**
 * Type definition for tRPC/React Query errors
 * Covers the common error structure from tRPC client errors
 * Made flexible to handle various tRPC error shapes including null values
 */
export type TRPCQueryError = {
  message?: string | null;
  data?: unknown | null;  // More flexible to handle different data shapes
  shape?: {
    message?: string | null;
    // tRPC error codes are strings (e.g., "UNAUTHORIZED", "TOO_MANY_REQUESTS")
    code?: string | null;
    data?: unknown | null;
  } | null;
};

/**
 * Utility function to extract error message from tRPC error
 * Handles various possible locations where the message might be stored,
 * including null values
 */
export const getTRPCErrorMessage = (error: TRPCQueryError): string => {
  return error.message || error.shape?.message || 'An unexpected error occurred';
};

/**
 * Type guard to check if an object has a message property of string type
 */
const hasStringMessage = (obj: unknown): obj is { message: string } => {
  return typeof obj === 'object' && obj !== null && 'message' in obj && typeof (obj as Record<string, unknown>).message === 'string';
};

/**
 * Type guard to check if an object looks like a tRPC error
 */
const isTRPCError = (obj: unknown): obj is TRPCQueryError => {
  return typeof obj === 'object' && obj !== null && ('message' in obj || 'shape' in obj);
};

/**
 * Safe resolver for unknown errors used across UI error boundaries
 */
export const resolveErrorMessage = (error: unknown): string => {
  if (!error) return 'An unexpected error occurred';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (hasStringMessage(error)) return error.message;
  if (isTRPCError(error)) return getTRPCErrorMessage(error);
  return 'An unexpected error occurred';
};