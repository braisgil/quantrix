'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
  const backHref = '/sessions';

  return (
    <div className="flex items-center justify-between">
      {onCancel ? (
        <Button 
          variant="ghost" 
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sessions
        </Button>
      ) : (
        <Button 
          asChild
          variant="ghost"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          <Link href={backHref}>
            <ArrowLeft className="w-4 h-4" />
            Back to Sessions
          </Link>
        </Button>
      )}
      {onDelete && (
        <SessionActionButtons sessionName={sessionName} onDeleteSession={onDelete} isDeleting={isDeleting} />
      )}
    </div>
  );
};