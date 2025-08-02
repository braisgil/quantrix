import { Skeleton } from '@/components/ui/skeleton';

export const AgentsListSkeleton: React.FC = () => {
  return (
    <div className="matrix-card p-8">
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
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
};