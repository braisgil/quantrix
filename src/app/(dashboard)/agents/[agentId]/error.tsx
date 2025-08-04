'use client';

import { ErrorBoundary } from '@/features/agents/components/shared/error-boundary';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AgentPageError({ error, reset }: ErrorPageProps) {
  return (
    <ErrorBoundary 
      error={error} 
      reset={reset}
      showBackButton={true}
      variant="card"
    />
  );
}