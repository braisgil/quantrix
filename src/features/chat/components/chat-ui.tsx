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
import { Skeleton } from "@/components/ui/skeleton";
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

  if (!client) {
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
          <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
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
        <div className="stream-theme-support h-full">
          <Chat client={client}>
            <Channel channel={channel}>
              <div className="flex h-full flex-col min-h-0">
                <Window>
                  <div className="flex-1 min-h-0 border-b bg-card">
                    <MessageList />
                  </div>
                  <div className="bg-background">
                    <MessageInput />
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