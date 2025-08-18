"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function NavigationProgress() {
  const pathname = usePathname()
  const [active, setActive] = useState(false)
  const startedAtRef = useRef<number | null>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const start = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
    if (!active) {
      startedAtRef.current = Date.now()
      setActive(true)
    }
  }, [active])

  const stop = () => {
    const minVisibleMs = 200
    const elapsed = startedAtRef.current ? Date.now() - startedAtRef.current : 0
    const remaining = Math.max(minVisibleMs - elapsed, 0)
    hideTimerRef.current = setTimeout(() => {
      setActive(false)
      startedAtRef.current = null
    }, remaining)
  }

  useEffect(() => {
    // Start on internal link clicks
    const onClick = (event: MouseEvent) => {
      // Respect modifier keys or default prevented events
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (!target) return
      const anchor = target.closest('a') as HTMLAnchorElement | null
      if (!anchor) return
      // Only same-origin, same-tab, non-download links
      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return
      // Ignore hash-only navigations
      if (url.pathname === window.location.pathname && url.hash) return
      start()
    }

    // Start on history navigation (back/forward)
    const onPopState = () => start()

    // Start on custom programmatic navigation events (e.g., command palette)
    const onProgrammaticStart = () => start()

    const captureOptions: AddEventListenerOptions = { capture: true }
    document.addEventListener('click', onClick, captureOptions)
    window.addEventListener('popstate', onPopState)
    window.addEventListener('quantrix:navigation-start', onProgrammaticStart as EventListener)
    return () => {
      document.removeEventListener('click', onClick, captureOptions)
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('quantrix:navigation-start', onProgrammaticStart as EventListener)
    }
  }, [start])

  // Stop when the pathname updates (route change finished)
  useEffect(() => {
    if (active) stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
      {/* Elegant top progress bar */}
      <div className={`fixed inset-x-0 top-0 z-[100] transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="relative h-0.5 sm:h-1 w-full overflow-hidden bg-primary/15 dark:bg-primary/20">
          <div
            className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-90"
            style={{ animation: 'navProgress 1.1s ease-in-out infinite' }}
          />
        </div>
      </div>

      {/* Compact badge indicator */}
      <div className={`fixed top-2 left-1/2 -translate-x-1/2 z-[100] transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/85 dark:bg-background/70 px-3 py-1.5 shadow-sm backdrop-blur-md text-xs text-primary">
          <span className="font-medium">Navigating…</span>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        </div>
      </div>

      <style jsx>{`
        @keyframes navProgress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  )
}


