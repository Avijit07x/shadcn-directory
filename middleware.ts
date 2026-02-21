import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { rateLimitAuthMiddleware } from "./lib/rateLimitEdge";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    const response = await rateLimitAuthMiddleware(request);
    if (response.status === 429) return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/auth/:path*"
  ]
};
