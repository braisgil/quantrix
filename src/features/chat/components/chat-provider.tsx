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
      <Card className="matrix-card border-primary/20 backdrop-blur-md overflow-hidden">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-64 w-full" />
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