import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL as string);

redis.on('error', (err) => console.error('Redis Client Error', err));

export async function getRedisClient() {
  return redis;
}

const DEFAULT_TTL = 60; 

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient();
    const data = await client.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.warn(`Cache read error for key ${key}:`, error);
    return null;
  }
}

export async function setCachedData<T>(
  key: string,
  data: T,
  ttlInSeconds: number = DEFAULT_TTL
): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.set(key, JSON.stringify(data), 'EX', ttlInSeconds);
  } catch (error) {
    console.warn(`Cache write error for key ${key}:`, error);
  }
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.del(key);
  } catch (error) {
    console.warn(`Cache delete error for key ${key}:`, error);
  }
}

export { redis };
