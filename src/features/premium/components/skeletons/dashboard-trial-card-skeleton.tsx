import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Brain } from 'lucide-react';

export const DashboardTrialCardSkeleton = () => {
  return (
    <div className="matrix-card border border-primary/20 rounded-lg w-full flex flex-col overflow-hidden">
      <div className="p-4 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary/15 to-transparent rounded-lg matrix-glow">
              <Brain className="size-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-3">
          {[0, 1, 2].map((key) => (
            <div key={key} className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Progress value={0} className="w-full h-1.5 matrix-border" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-primary/10 border-t border-primary/20 rounded-t-none text-primary font-semibold matrix-glow" />
    </div>
  );
};
