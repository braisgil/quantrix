import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Define route patterns for better organization
const PUBLIC_ROUTES = ['/', '/sign-in', '/sign-up']
const AUTH_ROUTES = ['/sign-in', '/sign-up']
const PROTECTED_ROUTE_PREFIXES = [
  '/agents',
  '/sessions',
  '/upgrade',
  '/overview',
  '/call'
]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Get session from better-auth
  const session = await auth.api.getSession({
    headers: request.headers
  })

  const isAuthenticated = !!session?.user
  
  // Check route types
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some(prefix => 
    pathname.startsWith(prefix)
  )

  // Public routes are accessible to everyone
  if (isPublicRoute && !isAuthRoute) {
    return NextResponse.next()
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    // Get the redirect URL from query params or default to /agents
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/agents'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  // Redirect unauthenticated users to sign-in for protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const signInUrl = new URL('/sign-in', request.url)
    // Save the original URL they were trying to access
    signInUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|public).*)',
  ],
}