import { Skeleton } from '@/components/ui/skeleton';
import { FolderOpen, MessageSquare } from 'lucide-react';

export const SessionDetailSkeleton = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Navigation Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Session Header Skeleton */}
      <div className="matrix-card p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg matrix-glow">
            <FolderOpen className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-96 mb-3" />
            <div className="flex items-center gap-4 text-sm">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Conversations List Skeleton */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="matrix-card p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <div className="flex items-center gap-4 text-sm">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Card Skeleton */}
        <div className="space-y-4">
          <div className="matrix-card p-4">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <Skeleton className="h-6 w-32" />
            </div>

            {/* Chat Messages Skeleton */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${i % 2 === 0 ? 'bg-primary/10' : 'bg-muted'} rounded-lg p-3`}>
                    <Skeleton className={`h-4 ${i % 3 === 0 ? 'w-32' : i % 2 === 0 ? 'w-48' : 'w-40'}`} />
                    {i % 2 === 0 && <Skeleton className="h-4 w-24 mt-1" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input Skeleton */}
            <div className="flex gap-2 mt-4">
              <Skeleton className="flex-1 h-10" />
              <Skeleton className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
