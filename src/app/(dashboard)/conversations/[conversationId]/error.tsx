'use client';

import { ErrorBoundary } from '@/features/conversations/components/shared/error-boundary';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ConversationPageError({ error, reset }: ErrorPageProps) {
  return (
    <ErrorBoundary 
      error={error} 
      reset={reset}
      showBackButton={true}
      variant="card"
    />
  );
} 