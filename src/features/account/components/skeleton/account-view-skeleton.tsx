"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const AccountViewSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Section Skeleton - matching agents-list pattern */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-6 w-96 mt-2" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="space-y-8">
        <div className="flex space-x-1 bg-muted/50 p-1 rounded-md w-full max-w-md">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
        
        <div className="mt-8 space-y-6">
          {/* Content Area Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </div>
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 space-y-3 border rounded-lg">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
