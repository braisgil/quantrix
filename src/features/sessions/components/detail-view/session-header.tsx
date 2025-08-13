'use client';

import { Badge } from "@/components/ui/badge";
import { CardHeader } from "@/components/ui/card";
import { FolderOpen, Bot, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { SessionGetOne } from "../../types";
import { SessionStatus } from "../../types";
import { 
  getSessionStatusIcon, 
  getSessionStatusLabel
} from "../../utils";

interface SessionHeaderProps {
  session: SessionGetOne;
}

export const SessionHeader = ({ session }: SessionHeaderProps) => {
  const StatusIcon = getSessionStatusIcon(session.status as SessionStatus);
  const statusLabel = getSessionStatusLabel(session.status as SessionStatus);
  
  return (
    <CardHeader className="text-center pb-0 sm:pb-0">
      {/* Header with Icon and Title */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="relative matrix-glow">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center matrix-border">
            <FolderOpen className="w-4 h-4 text-black" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold quantrix-gradient matrix-text-glow">
          {session.name}
        </h1>
      </div>
      
      {/* Status and Info Badges */}
      <div className="flex flex-wrap gap-2 justify-center mb-2">
        <Badge variant="secondary" className="matrix-border matrix-glow">
          {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
          {statusLabel}
        </Badge>
        <Badge variant="secondary" className="matrix-border matrix-glow">
          <Bot className="h-3 w-3 mr-1" />
          {session.agent.name}
        </Badge>
        <Badge variant="secondary" className="matrix-border matrix-glow">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
        </Badge>
      </div>
      
      {/* Description */}
      {session.description && (
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          {session.description}
        </p>
      )}
    </CardHeader>
  );
};