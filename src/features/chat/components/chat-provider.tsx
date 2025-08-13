"use client";

import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";

import { ChatUI } from "./chat-ui";

interface Props {
  channelId: string;
  channelName: string;
}

export const ChatProvider = ({ channelId, channelName }: Props) => {
  const { data, isPending } = authClient.useSession();

  if (isPending || !data?.user) {
    return (
      <Card className="matrix-card border-primary/20 backdrop-blur-md flex flex-col h-[calc(100vh-12rem)] sm:h-[70vh] min-h-[420px]">
        <CardContent className="p-0 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">Loading Chat UI...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ChatUI
      channelId={channelId}
      channelName={channelName}
      userId={data.user.id}
      userName={data.user.name}
      userImage={data.user.image ?? ""}
    />
  )
};