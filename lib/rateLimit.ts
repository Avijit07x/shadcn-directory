import { getRedisClient } from "@/lib/cache";

export const authFallback = new Map<string, { count: number; resetTime: number }>();
export const actionFallback = new Map<string, { count: number; resetTime: number }>();

export async function checkRateLimit(
  ip: string,
  fallbackMap: Map<string, { count: number; resetTime: number }>,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; isFallback: boolean }> {
  try {
    const redis = await getRedisClient();
    const key = `ratelimit:${ip}`;
    
    const currentCount = await redis.incr(key);
    
    if (currentCount === 1) {
      await redis.pexpire(key, windowMs);
    }
    
    if (currentCount > limit) {
      return { success: false, isFallback: false };
    }
    
    return { success: true, isFallback: false };
  } catch (error) {
    console.warn("Redis rate limit failed, falling back to memory:", error);
    
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
}
