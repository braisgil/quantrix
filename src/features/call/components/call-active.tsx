"use client";

import Link from "next/link";
import { Home, Phone } from "lucide-react";
import {
  CallControls,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import type { CallActiveProps } from "../types";

export const CallActive = ({ onLeave, conversationName }: CallActiveProps) => {
  return (
    <div className="flex flex-col justify-between h-screen matrix-bg p-2 sm:p-3">
      {/* Header */}
      <div className="matrix-card border-primary/20 rounded-lg sm:rounded-xl p-2 sm:p-3 flex items-center gap-2 backdrop-blur-md mb-2">
        <Link 
          href="/" 
          className="flex items-center justify-center p-1 sm:p-1.5 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors shrink-0"
          title="Go to homepage"
        >
          <Home className="h-4 w-4 text-primary" />
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
          <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0" />
          <h4 className="text-sm sm:text-base font-semibold matrix-text-glow truncate">
            {conversationName}
          </h4>
        </div>
      </div>

      {/* Video Layout */}
      <div className="flex-1 mb-2 stream-video-layout-wrapper min-h-0">
        <SpeakerLayout />
      </div>

      {/* Controls */}
      <div className="matrix-card border-primary/20 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 backdrop-blur-md">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
};
