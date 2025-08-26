"use client";

import { useState, useEffect } from "react";
import { StreamTheme, useCall, CallingState, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useQueryConversation } from "@/features/conversations/api/use-query-conversation";

import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";
import type { CallUIProps, CallState } from "../types";

// Import CSS
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./call-styles.css";

export const CallUI = ({ conversationId, conversationName }: CallUIProps) => {
  const call = useCall();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const router = useRouter();
  const { data: conversation } = useQueryConversation(conversationId);
  const [show, setShow] = useState<CallState>("lobby");
  const [hasJoinedOnce, setHasJoinedOnce] = useState(false);

  // Monitor conversation status for backend termination
  useEffect(() => {
    if (conversation?.status === "completed") {
      let metadata: { forceTerminated?: boolean; overdraftPrevention?: boolean } = {};
      try {
        metadata = conversation.metadata ? JSON.parse(conversation.metadata) : {};
      } catch {}

      if (metadata.forceTerminated || metadata.overdraftPrevention) {
        router.push(`/call/${conversationId}`);
      } else {
        setShow("ended");
      }
    }
  }, [conversation?.status, conversation?.metadata, conversationId, router]);

  const handleJoin = async () => {
    if (!call) return;

    try {
      await call.join();
      setShow("call");
      setHasJoinedOnce(true);
    } catch (error) {
      console.error("Failed to join call:", error);
      // Handle join errors gracefully
    }
  };

  const handleLeave = async () => {
    if (!call) return;

    try {
      // Check if call is already left to avoid "already left" error
      if (call.state.callingState !== CallingState.LEFT && 
          call.state.callingState !== CallingState.IDLE &&
          call.state.callingState !== CallingState.OFFLINE) {
        console.warn("Leaving call...", call.state.callingState);
        await call.leave();
      } else {
        console.warn("Call already left or idle, skipping leave");
      }
      setShow("ended");
    } catch (error) {
      console.error("Error leaving call:", error);
      // Check if it's the "already left" error specifically
      if (error instanceof Error && (error.message.includes("already been left") || error.message.includes("already left"))) {
        console.warn("Call was already left - this is expected");
      }
      // Even if there's an error, still show ended state
      setShow("ended");
    }
  };

  // If the underlying Stream call transitions to a non-joined state after join, end the UI
  useEffect(() => {
    if (!call) return;
    if (
      hasJoinedOnce && (
        callingState === CallingState.LEFT ||
        callingState === CallingState.OFFLINE
      )
    ) {
      setShow("ended");
    }
  }, [call, callingState, hasJoinedOnce]);

  return (
    <StreamTheme className="h-full">
      {show === "lobby" && <CallLobby onJoin={handleJoin} />}
      {show === "call" && <CallActive onLeave={handleLeave} conversationName={conversationName} />}
      {show === "ended" && (
        // If the conversation has overdraft metadata, prefer overdraft messaging
        <CallEnded variant={(conversation?.metadata && (() => { try { const m = JSON.parse(conversation.metadata); return (m.forceTerminated || m.overdraftPrevention) ? 'overdraft' : 'normal'; } catch { return 'normal'; } })()) || 'normal'} />
      )}
    </StreamTheme>
  )
};
