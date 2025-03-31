import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Don't redirect from the landing page
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next()
  }

  // Other middleware logic...
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Add matchers as needed, but exclude the root path
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

