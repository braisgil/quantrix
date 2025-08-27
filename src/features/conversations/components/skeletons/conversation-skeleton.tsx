'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ConversationSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Navigation skeleton */}
      <Skeleton className="h-8 w-48" />

      {/* Main card skeleton */}
      <Card className="w-full mx-auto matrix-card border-primary/20 backdrop-blur-md">
        <CardContent className="p-6">
          {/* Header skeleton */}
          <div className="flex items-start space-x-4 mb-8">
            <Skeleton className="w-16 h-16 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>

          {/* Content grid skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>

          {/* Summary skeleton */}
          <Skeleton className="h-32 w-full mb-6" />

          {/* Actions skeleton */}
          <div className="flex flex-wrap gap-3 pt-6 border-t border-border/50">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

