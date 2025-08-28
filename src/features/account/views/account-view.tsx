"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Crown } from 'lucide-react';

// Import existing feature components
import CreditsView from '@/features/credits/views/credits-view';
import { UpgradeView } from '@/features/premium/views/upgrade-view';
import { UpgradeFooter, UpgradeHeader } from '@/features/premium/components';
import { useQueryCurrentSubscription } from '@/features/premium/api';
import { authClient } from "@/lib/auth-client";

export const AccountView: React.FC = () => {
  const { data: currentSubscription } = useQueryCurrentSubscription();
  
  return (
    <div className="space-y-8">
      <UpgradeHeader
        hasSubscription={!!currentSubscription}
        onManageSubscription={() => authClient.customer.portal()}
        currentPlanName={currentSubscription?.name}
      />
      {/* Unified Account Management */}
      <div className="space-y-8">
        <Tabs defaultValue="subscription" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md bg-muted/50">
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Subscription</span>
              <span className="sm:hidden">Plans</span>
            </TabsTrigger>
            <TabsTrigger value="credits" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Credits</span>
              <span className="sm:hidden">Credits</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="subscription" className="space-y-6 mt-0">              
              {/* Embed the existing UpgradeView with adjusted styling */}
              <UpgradeView />
            </TabsContent>

            <TabsContent value="credits" className="space-y-6 mt-0">
              {/* Embed the existing CreditsView */}
              <CreditsView />
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <UpgradeFooter />
    </div>
  );
};
