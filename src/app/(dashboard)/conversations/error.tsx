'use client';

import { ErrorBoundary } from '@/features/conversations/components/shared/error-boundary';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ConversationsPageError({ error, reset }: ErrorPageProps) {
  return (
    <ErrorBoundary 
      error={error} 
      reset={reset}
      title="Failed to load conversations"
      variant="simple"
    />
  );
} 