import { SessionListItem } from "./session-list-item";
import type { SessionGetMany } from "../../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionsListProps {
  sessions: SessionGetMany;
}

export const SessionsList = ({ sessions  }: SessionsListProps) => {


  return (
    <Card className="matrix-card">
    <CardHeader>
      <CardTitle className="text-xl">Sessions List</CardTitle>
      <CardDescription>
        Organize your AI conversations by topic
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {sessions.map((session) => (
        <SessionListItem key={session.id} session={session} />
      ))}

    </CardContent>
    </Card>
  );
};