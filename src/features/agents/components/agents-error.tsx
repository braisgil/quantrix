import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TRPCQueryError, getTRPCErrorMessage } from '@/lib/types';

interface AgentsErrorProps {
  error: TRPCQueryError;
  onRetry?: () => void;
}

export const AgentsError: React.FC<AgentsErrorProps> = ({ error, onRetry }) => {
  const errorMessage = getTRPCErrorMessage(error);

  return (
    <div className="matrix-card p-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Failed to load agents
          </h3>
          <p className="text-sm text-muted-foreground">
            {errorMessage}
          </p>
        </div>
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm"
            className="matrix-glow"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};