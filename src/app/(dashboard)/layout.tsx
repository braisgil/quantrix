'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthSession } from '@/hooks/use-auth-session'
import { TRPCReactProvider } from '@/trpc/client'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { session, isLoading } = useAuthSession()

  useEffect(() => {
    // Additional client-side protection
    if (!isLoading && !session) {
      router.push('/sign-in')
    }
  }, [session, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Don't render children if not authenticated
  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <TRPCReactProvider>
        {children}
      </TRPCReactProvider>
    </div>
  )
} 