'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, RefreshCw, Phone } from 'lucide-react';
import Link from 'next/link';
import { TRPCQueryError, getTRPCErrorMessage } from '@/lib/types';

interface CallErrorBoundaryProps {
  error: Error | TRPCQueryError;
  onRetry?: () => void;
  reset?: () => void;
  title?: string;
  message?: string;
  conversationId?: string;
  variant?: 'simple' | 'card';
}

export const CallErrorBoundary: React.FC<CallErrorBoundaryProps> = ({
  error,
  onRetry,
  reset,
  title,
  message,
  conversationId,
  variant = 'card'
}) => {
  const isNotFound = error?.message?.includes('not found') || error?.message?.includes('NOT_FOUND');
  const errorMessage = 'getTRPCErrorMessage' in error ? getTRPCErrorMessage(error) : error.message;
  
  const handleRetry = onRetry || reset;
  
  // Special handling for "not found" errors
  if (isNotFound) {
    return (
      <div className="flex h-screen items-center justify-center p-4 matrix-bg">
        <Card className="matrix-card max-w-md mx-auto border-primary/20 backdrop-blur-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl matrix-text-glow">Conversation Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              The conversation you&apos;re trying to join doesn&apos;t exist or may have been deleted.
            </p>
            
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/conversations" className="inline-flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to conversations
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/overview">
                  Go to overview
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Simple variant for inline errors
  if (variant === 'simple') {
    return (
      <div className="matrix-card p-8 border-primary/20 backdrop-blur-md">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Phone className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground matrix-text-glow">
              {title || 'Unable to start call'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {message || errorMessage}
            </p>
          </div>
          {handleRetry && (
            <Button 
              onClick={handleRetry} 
              variant="default" 
              size="sm"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Card variant for full-screen errors
  return (
    <div className="flex h-screen items-center justify-center p-4 matrix-bg">
      <Card className="matrix-card max-w-md mx-auto border-primary/20 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl matrix-text-glow">{title || 'Call Error'}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            {message || errorMessage}
          </p>
          
          <div className="flex flex-col gap-3">
            {handleRetry && (
              <Button 
                onClick={handleRetry}
                className="w-full inline-flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            
            <Button asChild variant="outline" className="w-full">
              <Link 
                href={conversationId ? `/conversations/${conversationId}` : '/conversations'} 
                className="inline-flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {conversationId ? 'View conversation' : 'Back to conversations'}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};