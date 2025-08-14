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
    code?: number | null;
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
 * Safe resolver for unknown errors used across UI error boundaries
 */
export const resolveErrorMessage = (error: unknown): string => {
  if (!error) return 'An unexpected error occurred';
  if (typeof error === 'string') return error;
  if (error instanceof Error && typeof error.message === 'string') return error.message;
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof (error as { message?: unknown }).message === 'string') {
      return (error as { message: string }).message;
    }
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    ('message' in (error as object) || 'shape' in (error as object))
  ) {
    return getTRPCErrorMessage(error as TRPCQueryError);
  }
  return 'An unexpected error occurred';
};