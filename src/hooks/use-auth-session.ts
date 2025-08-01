'use client'

import { useSession } from '@/lib/auth-client'

export function useAuthSession() {
  const { data: session, isPending: isLoading } = useSession()

  return {
    session: session?.user ? session : null,
    isLoading,
    user: session?.user || null,
  }
} 