"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface CreditWarning {
  type: "warning" | "critical";
  credits: number;
  warnings: string[];
  timeRemaining?: string;
  deadlineAt?: number;
}

interface CreditWarningDialogProps {
  warning: CreditWarning | null;
  onDismiss: () => void;
  onEndCall: () => void;
}

export const CreditWarningDialog = ({
  warning,
  onDismiss,
  onEndCall,
}: CreditWarningDialogProps) => {
  const [countdown, setCountdown] = useState<string>("");

  // Update countdown for critical warnings using deadline timestamp
  useEffect(() => {
    if (!warning || warning.type !== "critical" || !warning.deadlineAt) {
      setCountdown("");
      return;
    }

    const updateCountdown = () => {
      const remainingMs = Math.max(0, warning.deadlineAt! - Date.now());
      const totalSeconds = Math.floor(remainingMs / 1000);
      const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
      const seconds = (totalSeconds % 60).toString().padStart(2, "0");
      setCountdown(`${minutes}:${seconds}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [warning]);

  if (!warning) return null;

  const isCritical = warning.type === "critical";

  return (
    <Dialog open={true} onOpenChange={onDismiss}>
      <DialogContent className="sm:max-w-md matrix-card border-primary/20">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isCritical ? "bg-red-500/10" : "bg-yellow-500/10"
              }`}
            >
              {isCritical ? (
                <AlertTriangle className="h-6 w-6 text-red-500" />
              ) : (
                <CreditCard className="h-6 w-6 text-yellow-500" />
              )}
            </div>
            <div>
              <DialogTitle className={isCritical ? "text-red-500" : "text-yellow-500"}>
                {isCritical ? "CRITICAL: Low Credits" : "Credit Warning"}
              </DialogTitle>
              <Badge
                variant={isCritical ? "destructive" : "secondary"}
                className="mt-1"
              >
                {warning.credits} credits remaining
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="space-y-3">
            {warning.warnings.map((msg, index) => (
              <p
                key={index}
                className={`text-sm ${
                  isCritical ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"
                }`}
              >
                • {msg}
              </p>
            ))}

            {isCritical && countdown && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Auto-termination in: {countdown}</span>
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Call will end automatically to prevent overdraft
                </p>
              </div>
            )}
          </div>
        </DialogDescription>

        <DialogFooter className="flex gap-2 mt-4">
          {isCritical ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onDismiss}
              >
                Continue (risky)
              </Button>
              <Button
                variant="destructive" 
                size="sm"
                onClick={onEndCall}
                className="bg-red-600 hover:bg-red-700"
              >
                End Call Now
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onDismiss}
              >
                Continue Call
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onEndCall}
              >
                End Call
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
