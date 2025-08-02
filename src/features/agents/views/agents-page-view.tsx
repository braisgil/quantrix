import React from 'react';
import { useQueryAgents } from '../api/use-query-agents';

const AgentsPageView: React.FC = () => {
  // With useSuspenseQuery, data is guaranteed to be defined
  // Loading states are handled by Suspense boundaries
  // Errors bubble up to error boundaries automatically
  const { data: agentsData } = useQueryAgents();

  return (
    <div className="matrix-card p-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Agents Data:</h3>
        {agentsData.items && agentsData.items.length > 0 ? (
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(agentsData.items, null, 2)}
          </pre>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>No agents created yet. Start by creating your first neural companion!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentsPageView;
