import { Suspense } from 'react';
import { CreditSuccessView } from '@/features/credits/views';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function CreditPurchaseSuccessPage() {
  return (
    <Suspense fallback={<CreditSuccessSkeleton />}>
      <CreditSuccessView />
    </Suspense>
  );
}

function CreditSuccessSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}