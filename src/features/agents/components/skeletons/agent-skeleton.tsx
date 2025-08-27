import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export type AgentSkeletonVariant = 'list' | 'detail';

interface AgentSkeletonProps {
  variant?: AgentSkeletonVariant;
  count?: number;
  className?: string;
}

export const AgentSkeleton: React.FC<AgentSkeletonProps> = ({
  variant = 'list',
  count = 3,
  className = ''
}) => {
  const renderListSkeleton = () => (
    <div className="matrix-card p-8">
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDetailSkeleton = () => (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Navigation Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-10 lg:hidden" />
      </div>

      {/* Main Card Skeleton */}
      <Card className="w-full mx-auto matrix-card border-primary/20 backdrop-blur-md">
        <CardHeader className="text-center pb-0 sm:pb-0">
          {/* Header with Icon and Title */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <Skeleton className="h-8 w-48" />
          </div>

          {/* Categories and Badges */}
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
          </div>
        </CardHeader>

        <CardContent className="pb-4 sm:pb-6">
          {/* Agent Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Agent Details */}
            <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
              <div className="flex items-center mb-3">
                <Skeleton className="w-4 h-4 mr-2" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>

            {/* Specialization */}
            <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
              <div className="flex items-center mb-3">
                <Skeleton className="w-4 h-4 mr-2" />
                <Skeleton className="h-5 w-28" />
              </div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Skeleton className="w-2 h-2 mt-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-3 w-full ml-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Configuration */}
          <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5 mb-6">
            <div className="flex items-center mb-3">
              <Skeleton className="w-4 h-4 mr-2" />
              <Skeleton className="h-5 w-36" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Skeleton className="w-2 h-2 mt-2" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-3 w-full ml-4" />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-36" />
          </div>
        </CardContent>
      </Card>
    </div>
  );



  const renderSkeleton = () => {
    switch (variant) {
      case 'detail':
        return renderDetailSkeleton();
      case 'list':
      default:
        return renderListSkeleton();
    }
  };

  return (
    <div className={className}>
      {renderSkeleton()}
    </div>
  );
};

