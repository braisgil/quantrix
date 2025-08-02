'use client';

import React, { Suspense } from 'react';
import AgentsListHeader from '@/features/agents/components/agents-list-header';
import { AgentWizard } from '@/features/agents/components/wizard';
import { useWizardState } from '@/features/agents/hooks/use-wizard-state';
import AgentsPageView from '@/features/agents/views/agents-page-view';
import { AgentsListSkeleton } from '@/features/agents/components/agents-list-skeleton';

const Page: React.FC = () => {
  const { showWizard, openWizard, closeWizard } = useWizardState();

  if (showWizard) {
    return (
      <div className="space-y-0">
        <AgentWizard 
          onSuccess={closeWizard}
          onCancel={closeWizard}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AgentsListHeader onCreateAgent={openWizard} />
      <Suspense fallback={<AgentsListSkeleton />}>
        <AgentsPageView />
      </Suspense>
    </div>
  );
};

export default Page;
