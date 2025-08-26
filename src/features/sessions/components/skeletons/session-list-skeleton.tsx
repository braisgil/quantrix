import { Skeleton } from '@/components/ui/skeleton';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen } from 'lucide-react';

interface SessionListSkeletonProps {
  count?: number;
}

export const SessionListSkeleton = ({ count = 5 }: SessionListSkeletonProps) => {
  return (
    <div>
      <CardHeader className="px-0 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <CardTitle className="text-lg font-bold quantrix-gradient matrix-text-glow">
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </div>
        <CardDescription>
          <Skeleton className="h-4 w-48" />
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="matrix-card flex flex-col sm:flex-row sm:items-start sm:justify-between p-5 bg-muted/50 rounded-lg border border-primary/20">
            <div className="flex-1 w-full">
              {/* Icon, Name, and Badges */}
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="hidden sm:block p-3 bg-primary/10 rounded-lg matrix-glow flex-shrink-0">
                  <FolderOpen className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-48 mb-2" />
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </CardContent>
    </div>
  );
};
