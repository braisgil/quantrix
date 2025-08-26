"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Home, Phone } from "lucide-react";
import {
  CallControls,
  SpeakerLayout,
  useCall,
} from "@stream-io/video-react-sdk";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { CreditWarningDialog, type CreditWarning } from "./credit-warning-dialog";
import type { CallActiveProps } from "../types";
import { CREDIT_FORCE_TERMINATION_THRESHOLD, CREDIT_CRITICAL_WINDOW_MS } from "@/lib/credits/constants";

export const CallActive = ({ onLeave, conversationName }: CallActiveProps) => {
  const call = useCall();
  const trpc = useTRPC();
  const [currentWarning, setCurrentWarning] = useState<CreditWarning | null>(null);
  const [criticalWarningShown, setCriticalWarningShown] = useState(false);
  const [_criticalDeadlineAt, setCriticalDeadlineAt] = useState<number | null>(null);
  const monitoringRef = useRef<NodeJS.Timeout | null>(null);

  // Get current user ID from the call
  const userId = call?.currentUserId;

  // One-time fetch of starting balance when call begins; do not refetch during call
  const { data: creditBalance } = useQuery({
    ...trpc.credits.getBalance.queryOptions(),
    enabled: !!userId,
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });

  // Credit monitoring effect
  useEffect(() => {
    if (!userId || !creditBalance) return;

    const startTime = Date.now();
    const startingBalance = creditBalance.totalAvailableCredits;
    
    const checkCredits = () => {
      try {
        // Calculate projected current balance based on elapsed time INCLUDING all future costs
        const elapsedMinutes = (Date.now() - startTime) / (1000 * 60);
        const videoCostPerMin = 0.8;  // Video call cost per minute
        const transcriptionCostPerMin = 7.2; // Transcription cost per minute (deducted at end)
        const processingCost = 38; // Processing cost (deducted at end)
        
        // Total costs: ongoing video + future transcription of full call + processing
        const videoCreditsUsed = elapsedMinutes * videoCostPerMin;
        const futureTranscriptionCost = elapsedMinutes * transcriptionCostPerMin; 
        const totalProjectedCost = videoCreditsUsed + futureTranscriptionCost + processingCost;
        const projectedBalance = startingBalance - totalProjectedCost;

        console.warn(`Call monitoring: ${elapsedMinutes.toFixed(1)}min elapsed, total projected cost: ${totalProjectedCost.toFixed(1)} credits, projected final balance: ${projectedBalance.toFixed(1)}`);

        // Fixed thresholds based on projected balance
        const FORCE_TERMINATION_THRESHOLD = CREDIT_FORCE_TERMINATION_THRESHOLD;

        if (projectedBalance < FORCE_TERMINATION_THRESHOLD && !criticalWarningShown) {
          const deadline = Date.now() + CREDIT_CRITICAL_WINDOW_MS;
          setCriticalDeadlineAt(deadline);
          setCriticalWarningShown(true);
          setCurrentWarning({
            type: "critical",
            credits: Math.round(projectedBalance),
            warnings: [
              `CRITICAL: Only ${projectedBalance.toFixed(0)} projected credits remaining after all costs!`,
              `${elapsedMinutes.toFixed(1)} min call projects ~${totalProjectedCost.toFixed(0)} credits total`,
              `Includes: video (${videoCreditsUsed.toFixed(1)}) + transcription (${futureTranscriptionCost.toFixed(1)}) + processing (${processingCost})`,
              `Server will end the call in ~3 minutes to prevent overdraft`
            ],
            deadlineAt: deadline,
          });
        }
      } catch (error) {
        console.error("Credit monitoring error:", error);
      }
    };

    // Check immediately
    checkCredits();
    
    // Then check every 15 seconds (same as backend)
    monitoringRef.current = setInterval(checkCredits, 15000);

    return () => {
      if (monitoringRef.current) {
        clearInterval(monitoringRef.current);
      }
    };
  }, [userId, creditBalance, criticalWarningShown]);

  // Handle warning dismissal
  const handleDismissWarning = () => {
    setCurrentWarning(null);
    // Do not reset criticalWarningShown; we want to show it only once.
  };

  // Handle ending call from warning
  const handleEndCallFromWarning = () => {
    setCurrentWarning(null);
    // Do not reset critical flag
    onLeave();
  };

  return (
    <>
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
          {/* Credit indicator */}
          {userId && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="hidden sm:inline">Credits monitored</span>
              <div className={`w-2 h-2 rounded-full ${
                currentWarning?.type === "critical" ? "bg-red-500 animate-pulse" :
                currentWarning?.type === "warning" ? "bg-yellow-500" : "bg-green-500"
              }`} />
            </div>
          )}
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

      {/* Credit Warning Dialog */}
      <CreditWarningDialog
        warning={currentWarning}
        onDismiss={handleDismissWarning}
        onEndCall={handleEndCallFromWarning}
      />
    </>
  );
};
