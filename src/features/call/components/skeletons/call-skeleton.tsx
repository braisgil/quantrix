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
            <div className="flex gap-4">
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
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 matrix-bg">
      <Card className="matrix-card border-primary/20 backdrop-blur-md w-full max-w-md sm:max-w-lg">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center gap-y-6">
            <Skeleton className="h-5 sm:h-6 w-28 sm:w-32 mx-auto bg-primary/10" />
            <Skeleton className="h-4 w-40 sm:w-48 mx-auto bg-primary/5" />

            <div className="flex flex-col items-center gap-y-4">
              <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Connecting...</span>
            </div>

            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-primary/10" />
              <Skeleton className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-primary/10" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

