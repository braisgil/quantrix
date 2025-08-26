import { Skeleton } from '@/components/ui/skeleton';

export const UpgradeViewSkeleton = () => {
  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-10">
      {/* Header Skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
        <div className="flex justify-center gap-4 mt-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Pricing Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="matrix-card border border-primary/20 rounded-lg p-6 text-center">
            <div className="space-y-4">
              <Skeleton className="h-6 w-24 mx-auto" />
              <Skeleton className="h-8 w-32 mx-auto" />
              <Skeleton className="h-4 w-48 mx-auto" />

              <div className="space-y-3 mt-6">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>

              <Skeleton className="h-10 w-full mt-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Skeleton */}
      <div className="text-center space-y-4 mt-8">
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
        <div className="flex justify-center gap-4 mt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
};
