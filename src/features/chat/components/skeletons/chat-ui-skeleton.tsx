import { Skeleton } from '@/components/ui/skeleton';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export const ChatUISkeleton = () => {
  return (
    <div className="h-[calc(100vh-12rem)] sm:h-[70vh] min-h-[420px] flex flex-col">
      <CardHeader className="px-0 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <CardTitle className="text-lg font-bold quantrix-gradient matrix-text-glow">
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </div>
        <CardDescription>
          <Skeleton className="h-4 w-48" />
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        <div className="stream-theme-support h-full w-full rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-matrix-green-glow/10 dark:border-matrix-green-glow/20 relative">
          {/* Chat messages area skeleton */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[80%] ${i % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar skeleton */}
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />

                  {/* Message content skeleton */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className={`h-16 w-48 ${i % 3 === 0 ? 'w-64' : i % 2 === 0 ? 'w-32' : 'w-56'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message input skeleton */}
          <div className="border-t border-border/50 p-4">
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-10 rounded-lg" />
              <Skeleton className="w-10 h-10 rounded-lg" />
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

