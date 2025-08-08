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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
      <Card className="matrix-card border-primary/20 backdrop-blur-md overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            {channelName || "Chat"}
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="matrix-card border-primary/20 backdrop-blur-md overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          {channelName || "Chat"}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <div className="stream-theme-support">
          <Chat client={client}>
            <Channel channel={channel}>
              <Window>
                <div className="flex-1 overflow-y-auto max-h-[calc(100vh-23rem)] border-b bg-card">
                  <MessageList />
                </div>
                <div className="bg-background">
                  <MessageInput />
                </div>
              </Window>
              <Thread />
            </Channel>
          </Chat>
        </div>
      </CardContent>
    </Card>
  )
}