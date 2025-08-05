'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const ConversationNavigationHeader: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/conversations');
  };

  return (
    <div className="flex items-center space-x-4 mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Conversations
      </Button>
    </div>
  );
}; 