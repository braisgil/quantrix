'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthSession } from '@/hooks/use-auth-session';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
    <div className="h-screen matrix-bg">
      {children}
    </div>
  );
};

export default Layout;
