'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/hooks/use-auth-session';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { SidebarCustom } from '@/components/layout/sidebar';
import { GlobalErrorBoundary } from '@/components/error-boundary/global-error-boundary';
import { NavigationProgress } from '@/components/navigation-progress';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { session, isLoading } = useAuthSession();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/sign-in');
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen matrix-bg matrix-section flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <GlobalErrorBoundary>
      <NavigationProgress />
      <SidebarProvider>
        <div className="flex min-h-screen w-full matrix-bg">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 blur-3xl pointer-events-none z-10"></div>
          <SidebarCustom />
          <SidebarInset className="flex flex-col flex-1 relative z-30">
            <Navbar />
            <main className="flex-1 p-6 matrix-container">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </GlobalErrorBoundary>
  );
}