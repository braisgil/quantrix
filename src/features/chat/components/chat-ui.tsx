import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import type { Channel as StreamChannel } from "stream-chat";
import {
  useCreateChatClient,
  Chat,
  Channel,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import { useTRPC } from "@/trpc/client";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

import "stream-chat-react/dist/css/v2/index.css";
import "./chat-styles.css";

interface ChatUIProps {
  channelId: string;
  channelName: string;
  userId: string;
  userName: string;
  userImage: string | undefined;
};

export const ChatUI = ({
  channelId,
  channelName,
  userId,
  userName,
  userImage,
}: ChatUIProps) => {
  const trpc = useTRPC();
  const { mutateAsync: generateChatToken } = useMutation(
    trpc.conversations.generateChatToken.mutationOptions(),
  );

  const [channel, setChannel] = useState<StreamChannel>();
  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
    tokenOrProvider: generateChatToken,
    userData: {
      id: userId,
      name: userName,
      image: userImage,
    },
  });

  useEffect(() => {
    if (!client) return;

    const channel = client.channel("messaging", channelId, {
      members: [userId],
    });

    setChannel(channel);
  }, [client, channelId, channelName, userId]);

  // Show a single site spinner until both client and channel are ready
  if (!client || !channel) {
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
        <CardContent className="p-0 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">Loading Chat UI...</span>
          </div>
        </CardContent>
      </div>
    );
  }

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
          <Chat client={client}>
            <Channel channel={channel}>
              <div className="flex h-full w-full flex-col min-h-0">
                <Window>
                  <div className="flex-1 min-h-0 w-full bg-card/80 backdrop-blur-sm">
                    <div className="h-full w-full border-b border-border/30 dark:border-matrix-green-glow/20">
                      <MessageList />
                    </div>
                  </div>
                  <div className="w-full bg-background/90 backdrop-blur-sm border-t border-border/30 dark:border-matrix-green-glow/20 p-3 relative overflow-visible">
                    <div className="w-full rounded-md border border-border/50 dark:border-matrix-green-glow/30 bg-card shadow-sm dark:shadow-matrix-green-glow/5 relative overflow-visible">
                      <MessageInput />
                    </div>
                  </div>
                </Window>
              </div>
              <Thread />
            </Channel>
          </Chat>
        </div>
      </CardContent>
    </div>
  )
}