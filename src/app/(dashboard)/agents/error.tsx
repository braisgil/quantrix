'use client';

import { ErrorBoundary } from '@/features/agents/components/shared/error-boundary';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AgentsPageError({ error, reset }: ErrorPageProps) {
  return (
    <ErrorBoundary 
      error={error} 
      reset={reset}
      title="Failed to load agents"
      variant="simple"
    />
  );
} 