import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Code, User, Shield, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const SignUpViewSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center matrix-glow">
                <Code className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-pulse">
                <User className="w-3 h-3 text-primary" />
              </div>
            </div>
          </div>
          <Skeleton className="h-10 w-32 mx-auto mb-3" />
          <Skeleton className="h-5 w-80 mx-auto mb-4" />
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Secure & Safe
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
              <Mail className="w-3 h-3 mr-1" />
              Email Verified
            </Badge>
          </div>
        </div>

        <Card className="matrix-card border-primary/30 shadow-2xl backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Name field skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Email field skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Password field skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Confirm password field skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Terms checkbox skeleton */}
              <div className="flex items-start gap-3">
                <Skeleton className="h-4 w-4 mt-1" />
                <Skeleton className="h-4 flex-1" />
              </div>

              {/* Submit button skeleton */}
              <Skeleton className="h-10 w-full" />

              {/* Social login buttons skeleton */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Skeleton className="flex-1 h-px" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="flex-1 h-px" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Links skeleton */}
              <div className="text-center">
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
