"use client";

import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, Lock } from "lucide-react";

import { ChatUI } from "./chat-ui";

interface Props {
  channelId: string;
  channelName: string;
  disabled?: boolean;
  disabledMessage?: string;
}

export const ChatProvider = ({ channelId, channelName, disabled, disabledMessage }: Props) => {
  const { data, isPending } = authClient.useSession();

  if (disabled) {
    return (
      <div className="h-[calc(100vh-12rem)] sm:h-[70vh] min-h-[420px] flex flex-col">
        <CardHeader className="px-0 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <CardTitle className="text-lg font-bold quantrix-gradient matrix-text-glow">
              {channelName || "Chat"}
            </CardTitle>
          </div>
          <CardDescription>Messages in this channel</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col min-h-0">
          <div className="stream-theme-support h-full w-full rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-matrix-green-glow/10 dark:border-matrix-green-glow/20 relative">
            <div className="h-full w-full flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center matrix-glow mb-6">
                  <Lock className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Chat unavailable</h3>
                <p className="text-sm text-muted-foreground">
                  {disabledMessage || "Chat is currently unavailable."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    );
  }

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