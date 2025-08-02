'use client';

import React, { useState } from 'react';
import AgentsListHeader from '@/features/agents/components/agents-list-header';
import { AgentWizard } from '@/features/agents/components/wizard';

const Page: React.FC = () => {
  const [showWizard, setShowWizard] = useState(false);

  const handleCreateAgent = () => {
    setShowWizard(true);
  };

  const handleWizardSuccess = () => {
    setShowWizard(false);
  };

  const handleWizardCancel = () => {
    setShowWizard(false);
  };

  if (showWizard) {
    return (
      <div className="space-y-0">
        <AgentWizard 
          onSuccess={handleWizardSuccess}
          onCancel={handleWizardCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <AgentsListHeader onCreateAgent={handleCreateAgent} />
      
      {/* Agents List - TODO: Add actual agents list here */}
      <div className="matrix-card p-8 text-center text-muted-foreground">
        <p>No agents created yet. Start by creating your first neural companion!</p>
      </div>
    </div>
  );
};

export default Page;
