import { NextRequest, NextResponse } from "next/server";

export const authFallback = new Map<string, { count: number; resetTime: number }>();

export async function checkRateLimitEdge(
  ip: string,
  fallbackMap: Map<string, { count: number; resetTime: number }>,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; isFallback: boolean }> {
  const now = Date.now();
  const record = fallbackMap.get(ip);
  
  if (!record || now > record.resetTime) {
    fallbackMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, isFallback: true };
  }
  
  if (record.count >= limit) {
    return { success: false, isFallback: true };
  }
  
  record.count += 1;
  return { success: true, isFallback: true };
}

export async function rateLimitAuthMiddleware(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { success } = await checkRateLimitEdge(ip, authFallback, 10, 60000);
  
  if (!success) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }
  return NextResponse.next();
}
