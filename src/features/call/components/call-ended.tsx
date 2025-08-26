import Link from "next/link";
import { CheckCircle, ArrowLeft, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CallEnded = ({ variant = "normal" }: { variant?: "normal" | "overdraft" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen matrix-bg p-4 sm:p-5">
      <Card className="matrix-card border-primary/20 backdrop-blur-md w-full max-w-sm sm:max-w-md mx-auto">
        <CardHeader className="text-center px-4 sm:px-5 pt-5 sm:pt-6">
          <div className={`mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 ${variant === 'overdraft' ? 'bg-warning/10' : 'bg-primary/10'}`}>
            {variant === 'overdraft' ? (
              <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 text-warning" />
            ) : (
              <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            )}
          </div>
          <CardTitle className="text-base sm:text-lg matrix-text-glow">
            {variant === 'overdraft' ? 'Call ended to prevent overdraft' : 'Call ended successfully'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4 px-4 sm:px-5 pb-5 sm:pb-6">
          <div className="space-y-1">
            {variant === 'overdraft' ? (
              <>
                <p className="text-sm text-muted-foreground">Your call reached the credit limit and was ended automatically to prevent overdraft.</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Transcription and summarization are being processed for the recorded portion.</p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Your conversation has been saved and processed.</p>
                <p className="text-xs sm:text-sm text-muted-foreground">A summary will appear in your conversations list shortly.</p>
              </>
            )}
          </div>
          
          <div className="space-y-2">
            <Button asChild className="w-full h-9 sm:h-10">
              <Link href="/conversations" className="inline-flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to conversations
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-9 sm:h-10">
              <Link href="/overview">
                Go to overview
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
