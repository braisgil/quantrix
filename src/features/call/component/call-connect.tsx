"use client";

import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";

import { useTRPC } from "@/trpc/client";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { CallUI } from "./call-ui";

interface CallConnectProps {
  conversationId: string;
  conversationName: string;
  userId: string;
  userName: string;
}

export const CallConnect = ({
  conversationId,
  conversationName,
  userId,
  userName,
}: CallConnectProps) => {
  const trpc = useTRPC();
  const { mutateAsync: generateToken } = useMutation(
    trpc.conversations.generateToken.mutationOptions(),
  );

  const [client, setClient] = useState<StreamVideoClient>();
  useEffect(() => {
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
      user: {
        id: userId,
        name: userName,
      },
      tokenProvider: generateToken,
    });

    setClient(_client);

    return () => {
      _client.disconnectUser();
      setClient(undefined);
    };
  }, [userId, userName, generateToken]);

  const [call, setCall] = useState<Call>();
  useEffect(() => {
      if (!client) return;

      const _call = client.call("default", conversationId);
      _call.camera.disable();
      _call.microphone.disable();
      setCall(_call);

      return () => {
        if (_call.state.callingState !== CallingState.LEFT) {
          _call.leave();
          _call.endCall();
          setCall(undefined);
        }
      };
  }, [client, conversationId]);

  if (!client || !call) {
    return (
      <div className="flex h-screen items-center justify-center matrix-bg">
        <LoaderIcon className="size-8 animate-spin text-primary matrix-text-glow" />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI conversationName={conversationName} />
      </StreamCall>
    </StreamVideo>
  );
};
