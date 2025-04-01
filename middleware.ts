import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public paths that don't require authentication
const publicPaths = ["/", "/login", "/register"]

// Define role-specific paths
const roleBasedPaths = {
  patient: ["/dashboard"],
  doctor: ["/doctor"],
  admin: ["/admin"],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for auth token
  const token = request.cookies.get("token")?.value
  const userRole = request.cookies.get("userRole")?.value

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If we have a token but no role, something's wrong - clear cookies and redirect to login
  if (!userRole) {
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("token")
    return response
  }

  // Check if user is accessing a path they're allowed to access
  const allowedPaths = roleBasedPaths[userRole as keyof typeof roleBasedPaths] || []
  const isAllowedPath = allowedPaths.some(path => pathname.startsWith(path))

  if (!isAllowedPath) {
    // Redirect to their default dashboard
    const defaultPath = roleBasedPaths[userRole as keyof typeof roleBasedPaths]?.[0] || "/"
    return NextResponse.redirect(new URL(defaultPath, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Add matchers as needed, but exclude API routes and static files
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
