"use client";

import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
        <CardContent className="p-4 flex-1 flex flex-col min-h-0">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-10 w-full" />
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