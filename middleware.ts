import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Get session from better-auth
  const session = await auth.api.getSession({
    headers: request.headers
  })

  const isAuthenticated = !!session?.user
  
  // Define route patterns
  const isHomePage = pathname === '/'
  const isAuthRoute = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')
  const isDashboardRoute = pathname.startsWith('/agents') || 
                          pathname.startsWith('/sessions') ||
                          pathname.match(/^\/[^\/]*$/) === null && !isAuthRoute && !isHomePage // Any nested route that's not auth or home

  // Home page is accessible to everyone
  if (isHomePage) {
    return NextResponse.next()
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/agents', request.url))
  }

  // Redirect unauthenticated users away from protected pages
  if (!isAuthenticated && isDashboardRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
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
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 