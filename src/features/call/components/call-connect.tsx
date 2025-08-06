"use client";


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
import { CallWrapper } from "./call-wrapper";
import type { CallConnectProps } from "../types";

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
      tokenProvider: async () => {
        const token = await generateToken();
        return token as string;
      },
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
      <div className="min-h-screen matrix-bg matrix-section flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallWrapper conversationName={conversationName} />
      </StreamCall>
    </StreamVideo>
  );
};
