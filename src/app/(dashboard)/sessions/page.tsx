import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Page: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold quantrix-gradient matrix-text-glow">
            Sessions
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your neural network sessions
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-black font-semibold matrix-glow">
          <Plus className="w-4 h-4 mr-2" />
          Create Session
        </Button>
      </div>

    </div>
  );
};

export default Page;
