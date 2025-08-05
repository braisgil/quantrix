'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, RefreshCw, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { TRPCQueryError, getTRPCErrorMessage } from '@/lib/types';

interface ErrorBoundaryProps {
  error: Error | TRPCQueryError;
  onRetry?: () => void;
  reset?: () => void;
  title?: string;
  message?: string;
  showBackButton?: boolean;
  backHref?: string;
  backText?: string;
  variant?: 'simple' | 'card';
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  error,
  onRetry,
  reset,
  title,
  message,
  showBackButton = false,
  backHref = '/conversations',
  backText = 'Back to Conversations',
  variant = 'card'
}) => {
  const isNotFound = error?.message?.includes('not found') || error?.message?.includes('NOT_FOUND');
  const errorMessage = 'getTRPCErrorMessage' in error ? getTRPCErrorMessage(error) : error.message;
  
  const handleRetry = onRetry || reset;
  
  // Special handling for "not found" errors
  if (isNotFound) {
    return (
      <Card className="matrix-card max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Conversation Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            The conversation you&apos;re looking for doesn&apos;t exist or may have been deleted.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default" className="matrix-button">
              <Link href={backHref} className="inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {backText}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Simple variant (for list views)
  if (variant === 'simple') {
    return (
      <div className="matrix-card p-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {title || 'Something went wrong'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {message || errorMessage}
            </p>
          </div>
          {handleRetry && (
            <Button 
              onClick={handleRetry} 
              variant="outline" 
              size="sm"
              className="matrix-glow"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Card variant (for individual views)
  return (
    <Card className="matrix-card max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <CardTitle className="text-2xl">{title || 'Something went wrong'}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <p className="text-muted-foreground">
          {message || errorMessage}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {handleRetry && (
            <Button 
              onClick={handleRetry}
              variant="default" 
              className="matrix-button inline-flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          
          {showBackButton && (
            <Button asChild variant="outline">
              <Link href={backHref} className="inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {backText}
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 