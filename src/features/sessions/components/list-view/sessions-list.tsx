import { SessionListItem } from "./session-list-item";
import type { SessionList, SessionItem } from "../../types";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionsListProps {
  sessions: SessionList;
  onDeleteSession?: (session: SessionItem) => void;
  deletingSessionId?: string;
}

export const SessionsList = ({ sessions, onDeleteSession, deletingSessionId }: SessionsListProps) => {


  return (
    <div>
    <CardHeader className="px-0 pb-6">
      <div className="flex items-center gap-3 mb-2">
        <CardTitle className="text-lg font-bold quantrix-gradient matrix-text-glow">
          Sessions List
        </CardTitle>
      </div>
      <CardDescription>
        Organize your AI conversations by topic
      </CardDescription>
    </CardHeader>
    <CardContent className="px-0 space-y-4">
      {sessions.map((session) => (
        <SessionListItem
          key={session.id}
          session={session}
          onDelete={onDeleteSession}
          isDeleting={deletingSessionId === session.id}
        />
      ))}

    </CardContent>
    </div>
  );
};