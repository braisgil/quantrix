"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CreditCard, Info, CheckCircle } from "lucide-react";
import { useQueryCreditStatus } from "../api";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SmartCreditBannerProps {
  operation?: "conversation" | "chat" | "general";
  estimatedDurationMinutes?: number;
  onProceedWithDegradation?: (options: {
    withSimplifiedProcessing?: boolean;
    useEmergencyCredits?: boolean;
  }) => void;
  onCancel?: () => void;
  className?: string;
}

export function SmartCreditBanner({
  operation = "general",
  estimatedDurationMinutes = 30,
  onProceedWithDegradation,
  onCancel,
  className = "",
}: SmartCreditBannerProps) {
  const { data: creditStatus } = useQueryCreditStatus();
  const [conversationEstimate, setConversationEstimate] = useState<{
    canStart: boolean;
    totalEstimatedCredits: number;
    breakdown: {
      videoCall: number;
      transcription: number;
      processing?: number;
    };
    warnings: string[];
    degradationOptions?: {
      withSimplifiedProcessing?: boolean;
      useEmergencyCredits?: boolean;
    };
  } | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const router = useRouter();

  const statusMessage = (() => {
    const status = creditStatus?.status || "healthy";
    const color = status === "critical" || status === "overdraft" ? "red" : status === "low" ? "yellow" : "green";
    const messageMap: Record<string, string> = {
      healthy: "Your credits look good.",
      low: "Credits running low. Consider purchasing more soon.",
      critical: "Credits critically low. Operations may fail.",
      overdraft: "Account in overdraft. Purchase credits immediately.",
    };
    return { status, color, message: messageMap[status] } as const;
  })();

  // Load conversation estimate when needed
  const loadConversationEstimate = async () => {
    if (operation === "conversation" && !conversationEstimate && !isEstimating) {
      setIsEstimating(true);
      try {
        // Basic local estimate based on current status; keep simple and predictable
        const videoCall = Math.ceil(estimatedDurationMinutes * 2 * 0.8);
        const transcription = Math.ceil(estimatedDurationMinutes * 7.2);
        const processing = 150;
        const totalEstimatedCredits = videoCall + transcription + processing;
        const warnings: string[] = [];
        if (creditStatus?.balance?.available !== undefined && creditStatus.balance.available < totalEstimatedCredits + 35) {
          warnings.push("You may run out of credits during the call; backend will terminate to prevent overdraft.");
        }
        setConversationEstimate({
          canStart: true,
          totalEstimatedCredits,
          breakdown: { videoCall, transcription, processing },
          warnings,
          degradationOptions: { withSimplifiedProcessing: true, useEmergencyCredits: true },
        });
      } finally {
        setIsEstimating(false);
      }
    }
  };

  // Load estimate when component mounts for conversation operations
  if (operation === "conversation") {
    loadConversationEstimate();
  }

  const handlePurchaseCredits = () => {
    router.push("/credits");
  };

  const handleProceedWithDegradation = (options: {
    withSimplifiedProcessing?: boolean;
    useEmergencyCredits?: boolean;
  }) => {
    onProceedWithDegradation?.(options);
  };

  // Don't show banner if status is healthy and operation is general
  if (statusMessage.status === "healthy" && operation === "general") {
    return null;
  }

  // Don't show for conversation if we can start normally
  if (operation === "conversation" && conversationEstimate?.canStart && conversationEstimate.warnings.length === 0) {
    return null;
  }

  const getIcon = () => {
    switch (statusMessage.status) {
      case "overdraft":
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      case "low":
        return <Info className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (statusMessage.status) {
      case "overdraft":
      case "critical":
        return "destructive" as const;
      case "low":
        return "default" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* General Credit Status */}
      <Alert variant={getVariant()}>
        {getIcon()}
        <AlertTitle className="flex items-center gap-2">
          Credit Status
          <Badge variant={statusMessage.color === "red" ? "destructive" : statusMessage.color === "yellow" ? "secondary" : "default"}>
            {statusMessage.status.toUpperCase()}
          </Badge>
        </AlertTitle>
        <AlertDescription>{statusMessage.message}</AlertDescription>
      </Alert>

      {/* Conversation-specific Estimates */}
      {operation === "conversation" && conversationEstimate && (
        <Alert variant={conversationEstimate.canStart ? "default" : "destructive"}>
          <CreditCard className="h-4 w-4" />
          <AlertTitle>
            Conversation Estimate ({estimatedDurationMinutes} minutes)
          </AlertTitle>
          <AlertDescription className="space-y-3">
            <div className="space-y-2">
              <p><strong>Estimated cost:</strong> {conversationEstimate.totalEstimatedCredits} credits</p>
              <div className="text-sm space-y-1">
                <p>• Video call: {conversationEstimate.breakdown.videoCall} credits</p>
                <p>• Transcription: {conversationEstimate.breakdown.transcription} credits <span className="text-xs text-muted-foreground">(required)</span></p>
                {conversationEstimate.breakdown.processing && (
                  <p>• Processing: {conversationEstimate.breakdown.processing} credits</p>
                )}
              </div>
            </div>

            {conversationEstimate.warnings.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium">Warnings:</p>
                <ul className="text-sm list-disc list-inside space-y-1">
                  {conversationEstimate.warnings.map((warning: string, index: number) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={handlePurchaseCredits}
                className="flex items-center gap-2"
              >
                <CreditCard className="h-3 w-3" />
                Purchase Credits
              </Button>

              {conversationEstimate.degradationOptions && (
                <>
                  {conversationEstimate.degradationOptions.withSimplifiedProcessing && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleProceedWithDegradation({ withSimplifiedProcessing: true })}
                    >
                      Start with Simplified Processing
                    </Button>
                  )}
                  
                  {conversationEstimate.degradationOptions.useEmergencyCredits && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleProceedWithDegradation({ useEmergencyCredits: true })}
                    >
                      Use Emergency Credit Buffer
                    </Button>
                  )}
                </>
              )}

              {onCancel && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Recommendations */}
      {conversationEstimate?.warnings && conversationEstimate.warnings.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Recommendations</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {conversationEstimate.warnings.map((warning: string, index: number) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

/**
 * Compact version for navigation or smaller spaces
 */
export function SmartCreditIndicator({ className = "" }: { className?: string }) {
  const router = useRouter();
  const { data: creditStatus } = useQueryCreditStatus();
  const statusMessage = (() => {
    const status = creditStatus?.status || "healthy";
    const messageMap: Record<string, string> = {
      healthy: "Your credits look good.",
      low: "Credits running low. Consider purchasing more soon.",
      critical: "Credits critically low. Operations may fail.",
      overdraft: "Account in overdraft. Purchase credits immediately.",
    };
    return { status, message: messageMap[status] } as const;
  })();
  
  const handleClick = () => {
    router.push("/credits");
  };

  const getColor = () => {
    switch (statusMessage.status) {
      case "overdraft":
      case "critical":
        return "text-red-600 bg-red-100 hover:bg-red-200";
      case "low":
        return "text-yellow-600 bg-yellow-100 hover:bg-yellow-200";
      default:
        return "text-green-600 bg-green-100 hover:bg-green-200";
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${getColor()} ${className}`}
      title={statusMessage.message}
    >
      {statusMessage.status === "healthy" ? "Credits OK" : `Credits ${statusMessage.status.toUpperCase()}`}
    </button>
  );
}
