'use client';

import { useEffect } from 'react';
import { CallErrorBoundary } from '@/features/call/components';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Call page error:', error);
  }, [error]);

  return (
    <CallErrorBoundary
      error={error}
      reset={reset}
      title="Failed to load call"
      message="There was an error loading the call. Please try again."
      variant="card"
    />
  );
}