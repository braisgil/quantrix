'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const CallSkeleton: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 matrix-bg">
      <Card className="matrix-card border-primary/20 backdrop-blur-md w-full max-w-md sm:max-w-lg">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center gap-y-6">
            {/* Title skeleton */}
            <div className="flex flex-col gap-y-2 text-center w-full">
              <Skeleton className="h-6 sm:h-8 w-40 sm:w-48 mx-auto bg-primary/10" />
              <Skeleton className="h-4 w-52 sm:w-64 mx-auto bg-primary/5" />
            </div>
            
            {/* Video preview skeleton */}
            <div className="w-full max-w-sm">
              <Skeleton className="w-full aspect-video rounded-lg bg-primary/10" />
            </div>
            
            {/* Controls skeleton */}
            <div className="flex gap-x-4">
              <Skeleton className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-primary/10" />
              <Skeleton className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-primary/10" />
            </div>
            
            {/* Buttons skeleton */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Skeleton className="h-10 sm:h-11 flex-1 bg-primary/5 rounded-md" />
              <Skeleton className="h-10 sm:h-11 flex-1 bg-primary/10 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const CallConnectingSkeleton: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center matrix-bg p-4">
      <div className="text-center space-y-6">
        <div className="animate-pulse">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/20 rounded-full mx-auto mb-4 animate-bounce matrix-glow" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 sm:h-6 w-28 sm:w-32 mx-auto bg-primary/10" />
          <Skeleton className="h-4 w-40 sm:w-48 mx-auto bg-primary/5" />
        </div>
      </div>
    </div>
  );
};