"use client";

import React, { Suspense } from "react";
import { 
  CreditBalanceCard, 
  CreditPackages, 
  CreditUsageChart, 
  CreditTransactionList 
} from "@/features/credits/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CreditsPage() {
  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Credits</h1>
        <p className="text-muted-foreground">
          Manage your credits and track usage across all services
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Suspense fallback={<CreditBalanceCardFallback /> }>
            <CreditBalanceCard 
              onPurchaseClick={() => {
                const packagesSection = document.getElementById("packages-section");
                packagesSection?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </Suspense>
        </div>
        <div className="md:col-span-2">
          <Suspense fallback={<Card className="h-[360px]"><CardHeader><Skeleton className="h-6 w-40" /><Skeleton className="h-4 w-64" /></CardHeader><CardContent><Skeleton className="h-[280px] w-full" /></CardContent></Card>}>
            <CreditUsageChart />
          </Suspense>
        </div>
      </div>

      <Tabs defaultValue="packages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="packages">Purchase Credits</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4" id="packages-section">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Credit Packages</h2>
            <p className="text-sm text-muted-foreground">
              Choose a package that suits your needs. Larger packages include bonus credits.
            </p>
          </div>
          <Suspense fallback={<PackagesFallback /> }>
            <CreditPackages />
          </Suspense>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <p className="text-sm text-muted-foreground">
              View your credit purchases and usage history
            </p>
          </div>
          <Suspense fallback={<TransactionsFallback /> }>
            <CreditTransactionList />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreditBalanceCardFallback() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-40" />
      </CardContent>
    </Card>
  );
}

function PackagesFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <Skeleton className="h-10 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TransactionsFallback() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-60" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
