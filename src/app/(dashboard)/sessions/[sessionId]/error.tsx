"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SessionDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Session detail error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="matrix-card border-primary/20 backdrop-blur-md max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-destructive/10 rounded-full">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Session Not Found</h2>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t find the session you&apos;re looking for. It may have been deleted or you may not have permission to view it.
            </p>
            {error.message && (
              <p className="text-xs text-destructive mt-2">
                {error.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push("/sessions")}
              className="border-primary/30 hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sessions
            </Button>
            <Button
              onClick={reset}
            className="matrix-glow bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}