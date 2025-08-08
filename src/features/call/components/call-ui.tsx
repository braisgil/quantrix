"use client";

import { useState } from "react";
import { StreamTheme, useCall } from "@stream-io/video-react-sdk";

import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";
import type { CallUIProps, CallState } from "../types";

// Import CSS
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./call-styles.css";

export const CallUI = ({ conversationName }: CallUIProps) => {
  const call = useCall();
  const [show, setShow] = useState<CallState>("lobby");

  const handleJoin = async () => {
    if (!call) return;

    await call.join();

    setShow("call");
  };

  const handleLeave = () => {
    if (!call) return;

    call.endCall();
    setShow("ended");
  };

  return (
    <StreamTheme className="h-full">
      {show === "lobby" && <CallLobby onJoin={handleJoin} />}
      {show === "call" && <CallActive onLeave={handleLeave} conversationName={conversationName} />}
      {show === "ended" && <CallEnded />}
    </StreamTheme>
  )
};
