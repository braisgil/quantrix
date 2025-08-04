'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AgentNavigationHeaderProps {
  onCancel?: () => void;
}

export const AgentNavigationHeader = ({ onCancel }: AgentNavigationHeaderProps) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/agents');
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Button 
        variant="ghost" 
        onClick={handleBackClick}
        className="text-muted-foreground hover:text-foreground flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Agents
      </Button>
      <Button 
        variant="ghost"
        size="sm" 
        onClick={handleBackClick}
        className="text-muted-foreground hover:text-foreground lg:hidden"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
