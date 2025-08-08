'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit, Settings, Trash2 } from 'lucide-react';
import { useDeleteAgent } from '../../api/use-delete-agent';
import { useRouter } from 'next/navigation';

interface AgentActionButtonsProps {
  agentId: string;
  agentName: string;
  onEditAgent: () => void;
  onConfigureAgent: () => void;
}

export const AgentActionButtons = ({ 
  agentId,
  agentName,
  onEditAgent, 
  onConfigureAgent 
}: AgentActionButtonsProps) => {
  const router = useRouter();
  const deleteAgentMutation = useDeleteAgent();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteAgentMutation.mutate({ id: agentId });
    setIsDeleteDialogOpen(false);
    // Redirect to agents list after deletion
    router.push('/agents');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button 
        onClick={onEditAgent}
        variant="outline" 
        size="sm"
        className="matrix-glow matrix-border w-full sm:w-auto"
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit Companion
      </Button>
      <Button 
        onClick={onConfigureAgent}
        variant="default" 
        size="sm"
        className="matrix-glow w-full sm:w-auto"
      >
        <Settings className="h-4 w-4 mr-2" />
        Configure Settings
      </Button>
      
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
                      <Button 
            size="sm"
            className="bg-destructive hover:bg-destructive/90 text-white dark:text-black font-semibold w-full sm:w-auto"
            disabled={deleteAgentMutation.isPending}
          >
              {deleteAgentMutation.isPending ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span>Delete</span>
                </>
              )}
            </Button>
          </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Agent</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete &ldquo;{agentName}&rdquo;? This action cannot be undone and will also delete all associated sessions and conversations.
            </AlertDialogDescription>
          </AlertDialogHeader>
                      <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-white dark:text-black font-semibold w-full sm:w-auto"
              disabled={deleteAgentMutation.isPending}
            >
              {deleteAgentMutation.isPending ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Delete</span>
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}; 