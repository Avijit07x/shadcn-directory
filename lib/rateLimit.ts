import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

// Verify if the user has provided real KV storage variables
const isKVConfigured = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

// Global Rate Limiter instance for Auth endpoints
export const authRatelimit = isKVConfigured ? new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
}) : null;

// Global Rate Limiter instance for Server Actions
export const actionRatelimit = isKVConfigured ? new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
}) : null;

// Pure In-Memory Fallbacks for local `pnpm dev` usage without Vercel backend
export const authFallback = new Map<string, { count: number; resetTime: number }>();
export const actionFallback = new Map<string, { count: number; resetTime: number }>();


// Shared Core rate limiting function
export async function checkRateLimit(
  ip: string,
  limiter: Ratelimit | null,
  fallbackMap: Map<string, { count: number; resetTime: number }>,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; isFallback: boolean }> {

  // Attempt the Vercel KV check exclusively in distributed mode
  if (limiter) {
    try {
      const { success } = await limiter.limit(ip);
      return { success, isFallback: false };
    } catch (e) {
      console.error("Vercel KV Rate limit error", e);
      // Fails over to memory if there's a temporary Upstash outage footprint
    }
  }

  // Local/Fallback Logic
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

// NextJS Middleware Helper
export async function rateLimitAuthMiddleware(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { success } = await checkRateLimit(ip, authRatelimit, authFallback, 10, 60000);
  
  if (!success) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }
  return NextResponse.next();
}
