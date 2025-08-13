'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { SessionActionButtons } from "../detail-view/session-action-buttons";

type SessionNavigationHeaderProps =
  | {
      onCancel?: () => void;
      onDelete: () => void;
      isDeleting?: boolean;
      sessionName: string;
    }
  | {
      onCancel?: () => void;
      onDelete?: undefined;
      isDeleting?: boolean;
      sessionName?: string;
    };

export const SessionNavigationHeader = ({ onCancel, onDelete, isDeleting, sessionName }: SessionNavigationHeaderProps) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/sessions');
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
        Back to Sessions
      </Button>
      {onDelete && (
        <SessionActionButtons sessionName={sessionName} onDeleteSession={onDelete} isDeleting={isDeleting} />
      )}
    </div>
  );
};