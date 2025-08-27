import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CreditsViewSkeleton: React.FC = () => {
  return (
    <div>
      <CardHeader className="px-0 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <CardTitle className="text-lg font-bold">
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </div>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="relative flex flex-col">
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
                <div className="pt-2 border-t space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </div>
  );
};

export default CreditsViewSkeleton;


