import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public paths that don't require authentication
const publicPaths = ["/", "/login", "/register"]

// Define role-specific paths
const roleBasedPaths = {
  patient: ["/dashboard", "/diagnoses", "/appointments", "/messages", "/analytics", "/profile", "/settings", "/support"],
  doctor: ["/doctor", "/doctor/profile", "/doctor/patients", "/doctor/appointments", "/doctor/records", "/doctor/treatments", "/doctor/messages", "/doctor/analytics", "/doctor/settings"],
  admin: ["/admin"],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log("Middleware - Current path:", pathname)
  
  // Allow public paths
  if (publicPaths.includes(pathname)) {
    console.log("Middleware - Public path, allowing access")
    return NextResponse.next()
  }

  // Check for auth token
  const token = request.cookies.get("token")?.value
  const userRole = request.cookies.get("userRole")?.value
  console.log("Middleware - Token:", !!token, "Role:", userRole)

  // If no token, redirect to login
  if (!token) {
    console.log("Middleware - No token, redirecting to login")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If we have a token but no role, something's wrong - clear cookies and redirect to login
  if (!userRole) {
    console.log("Middleware - No role found, clearing cookies")
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("token")
    return response
  }

  // Check if user is accessing a path they're allowed to access
  const allowedPaths = roleBasedPaths[userRole as keyof typeof roleBasedPaths] || []
  const isAllowedPath = allowedPaths.some(path => pathname.startsWith(path))
  console.log("Middleware - Allowed paths:", allowedPaths)
  console.log("Middleware - Is allowed path:", isAllowedPath)

  if (!isAllowedPath) {
    // Redirect to their default dashboard
    const defaultPath = roleBasedPaths[userRole as keyof typeof roleBasedPaths]?.[0] || "/"
    console.log("Middleware - Not allowed, redirecting to:", defaultPath)
    return NextResponse.redirect(new URL(defaultPath, request.url))
  }

  console.log("Middleware - Access granted")
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Add matchers as needed, but exclude API routes and static files
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
