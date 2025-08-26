"use client";

import React from "react";
import { 
  CreditBalanceCard, 
  CreditPackages, 
  CreditUsageChart, 
  CreditTransactionList 
} from "../components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CreditsView = () => {
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
          <CreditBalanceCard 
            onPurchaseClick={() => {
              const packagesSection = document.getElementById("packages-section");
              packagesSection?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </div>
        <div className="md:col-span-2">
          <CreditUsageChart />
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
          <CreditPackages />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <p className="text-sm text-muted-foreground">
              View your credit purchases and usage history
            </p>
          </div>
          <CreditTransactionList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

