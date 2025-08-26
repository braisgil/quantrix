"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useQueryCall } from "../api/use-query-call";
import { isConversationJoinAvailable } from "@/features/conversations/utils/conversation-helpers";
import { CallProvider } from "../components";
import type { CallViewProps } from "../types";

export const CallView = ({ conversationId }: CallViewProps) => {
  const { data: conversation } = useQueryCall(conversationId);

  if (conversation?.status === "completed") {
    // Check if call was terminated due to overdraft prevention
    let metadata: { forceTerminated?: boolean; overdraftPrevention?: boolean } = {};
    try {
      metadata = conversation.metadata ? JSON.parse(conversation.metadata) : {};
    } catch {
      // ignore parsing errors
    }
    
    const wasForceTerminated = metadata.forceTerminated || metadata.overdraftPrevention;
    
    return (
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 matrix-bg">
        <Card className="matrix-card w-full max-w-sm sm:max-w-md mx-auto border-primary/20 backdrop-blur-md">
          <CardHeader className="text-center px-4 sm:px-6 pt-6 sm:pt-8">
            <div className={`mx-auto w-14 h-14 sm:w-16 sm:h-16 ${wasForceTerminated ? 'bg-warning/10' : 'bg-primary/10'} rounded-full flex items-center justify-center mb-4`}>
              <AlertTriangle className={`h-7 w-7 sm:h-8 sm:w-8 ${wasForceTerminated ? 'text-warning' : 'text-primary'}`} />
            </div>
            <CardTitle className="text-lg sm:text-xl matrix-text-glow">
              {wasForceTerminated ? 'Call ended to prevent overdraft' : 'Meeting has ended'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4 px-4 sm:px-6 pb-6 sm:pb-8">
            {wasForceTerminated ? (
              <div className="space-y-2">
                <p className="text-sm sm:text-base text-muted-foreground">
                  Your call was automatically ended to prevent your account from going into overdraft.
                </p>
                <p className="text-xs text-muted-foreground bg-warning/5 p-2 rounded border">
                  Transcription and summarization will still be processed for the recorded portion. Consider purchasing more credits for longer calls.
                </p>
              </div>
            ) : (
              <p className="text-sm sm:text-base text-muted-foreground">
                You can no longer join this meeting. Check the conversation details for a summary.
              </p>
            )}
            <Button asChild variant="view" className="w-full h-10 sm:h-11">
              <Link href={`/conversations/${conversationId}`}>
                View conversation details
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!conversation || !isConversationJoinAvailable(conversation)) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 matrix-bg">
        <Card className="matrix-card w-full max-w-sm sm:max-w-md mx-auto border-primary/20 backdrop-blur-md">
          <CardHeader className="text-center px-4 sm:px-6 pt-6 sm:pt-8">
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-warning/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8 text-warning" />
            </div>
            <CardTitle className="text-lg sm:text-xl matrix-text-glow">Call not yet available</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4 px-4 sm:px-6 pb-6 sm:pb-8">
            <p className="text-sm sm:text-base text-muted-foreground">
              This call will be available 30 minutes before the scheduled start time.
            </p>
            <Button asChild variant="view" className="w-full h-10 sm:h-11">
              <Link href={`/conversations/${conversationId}`}>
                View conversation details
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <CallProvider conversationId={conversationId} conversationName={conversation?.name ?? ""} />;
};
