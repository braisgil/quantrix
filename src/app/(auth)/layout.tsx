'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthSession } from '@/hooks/use-auth-session'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { session, isLoading } = useAuthSession()

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!isLoading && session) {
      router.push('/agents')
    }
  }, [session, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen matrix-bg matrix-section flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Don't render auth forms if already authenticated
  if (session) {
    return null
  }

  return (
    <div className="min-h-screen matrix-bg matrix-section">
      {/* Animated Matrix Grid Background */}
      
      {/* Green Gradient Cloud Effect (from homepage hero) */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 blur-3xl pointer-events-none z-10"></div>
      
      <div className="relative z-30">
        {children}
      </div>
    </div>
  )
} 