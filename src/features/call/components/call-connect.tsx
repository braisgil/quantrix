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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useQueryCreditStatusNonSuspense } from "@/features/credits/api";

export const CallConnect = ({
  conversationId,
  conversationName,
  userId,
  userName,
}: CallConnectProps) => {
  const trpc = useTRPC();
  const { mutateAsync: generateCallToken } = useMutation(
    trpc.conversations.generateCallToken.mutationOptions(),
  );
  // Always call hooks at the top level to keep order consistent across renders
  const { data: status } = useQueryCreditStatusNonSuspense();

  const [userToken, setUserToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Prefetch token to surface errors before initializing SDK
  useEffect(() => {
    let cancelled = false;
    const fetchToken = async () => {
      try {
        const token = await generateCallToken({ conversationId });
        if (!cancelled) setUserToken(token as string);
      } catch (e: unknown) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : "Failed to start the call";
        setTokenError(message);
      }
    };
    fetchToken();
    return () => { cancelled = true; };
  }, [conversationId, generateCallToken]);

  const [client, setClient] = useState<StreamVideoClient>();
  useEffect(() => {
    if (!userToken) return;
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
      user: {
        id: userId,
        name: userName,
      },
      tokenProvider: async () => userToken,
    });

    setClient(_client);

    return () => {
      _client.disconnectUser();
      setClient(undefined);
    };
  }, [userId, userName, userToken]);

  const [call, setCall] = useState<Call>();
  useEffect(() => {
      if (!client) return;

      const _call = client.call("default", conversationId);
      _call.camera.disable();
      _call.microphone.disable();
      setCall(_call);

      return () => {
        try {
          const state = _call.state.callingState;
          if (state !== CallingState.LEFT && state !== CallingState.IDLE && state !== CallingState.OFFLINE) {
            _call.leave();
          }
        } finally {
          setCall(undefined);
        }
      };
  }, [client, conversationId]);

  if (tokenError) {
    return (
      <div className="min-h-screen matrix-bg flex items-center justify-center p-4">
        <Card className="matrix-card w-full max-w-sm sm:max-w-md mx-auto border-primary/20 backdrop-blur-md">
          <CardHeader className="text-center px-6 pt-8">
            <div className="mx-auto w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
            <CardTitle className="text-lg sm:text-xl matrix-text-glow">Call unavailable</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4 px-6 pb-8">
            <p className="text-sm text-muted-foreground">{tokenError}</p>
            {status?.recommendations?.length ? (
              <div className="text-xs text-muted-foreground bg-warning/5 p-2 rounded border">
                <ul className="list-disc list-inside text-left space-y-1">
                  {status.recommendations.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="grid grid-cols-1 gap-2">
              <Button asChild variant="view" className="w-full h-10">
                <Link href={`/credits`}>Purchase credits</Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-10">
                <Link href={`/conversations/${conversationId}`}>Back to conversation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userToken || !client || !call) {
    return (
      <div className="min-h-screen matrix-bg matrix-section flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallWrapper conversationId={conversationId} conversationName={conversationName} />
      </StreamCall>
    </StreamVideo>
  );
};
