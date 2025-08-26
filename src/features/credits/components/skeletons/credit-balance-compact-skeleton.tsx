import { Skeleton } from '@/components/ui/skeleton';

export const CreditBalanceCompactSkeleton = () => {
  return (
    <div className="flex items-center gap-2 h-9 px-3">
      <Skeleton className="size-4 rounded-full" />
      <Skeleton className="h-4 w-12" />
    </div>
  );
};
