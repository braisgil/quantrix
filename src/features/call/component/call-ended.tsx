import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CallEnded = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full matrix-bg p-4">
      <Card className="matrix-card border-primary/20 backdrop-blur-md max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl matrix-text-glow">Call ended successfully</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Your conversation has been saved and processed.
            </p>
            <p className="text-sm text-muted-foreground">
              A summary will appear in your conversations list shortly.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/conversations" className="inline-flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to conversations
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
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
