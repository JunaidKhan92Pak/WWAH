import { UserStore } from "@/store/useUserData";
import { Redis } from "@upstash/redis";

// Create Redis client with better error handling
const createRedisClient = () => {
  const url = process.env.REDIS_URL;
  const token = process.env.REDIS_TOKEN;

  if (!url || !token) {
    console.warn("Redis credentials not properly configured");
    return null;
  }

  return new Redis({ url, token });
};

const redis = createRedisClient();

// Cache TTL in seconds (1 hour)
const CACHE_TTL = 3600;

// Wrap Redis operations with error handling
async function safeRedisOperation<T>(
  operation: () => Promise<T>
): Promise<T | null> {
  if (!redis) {
    console.log("Redis client not available, skipping cache operation");
    return null;
  }

  try {
    return await operation();
  } catch (error) {
    console.error("Redis operation failed:", error);
    return null;
  }
}

// User data cache functions with error handling
export async function cacheUserData(
  userId: string,
  userData: UserStore
): Promise<void> {
  if (!redis) return;

  // Make sure data is properly stringified before storing
  const jsonData = JSON.stringify(userData);

  await safeRedisOperation(() =>
    redis.set(`user:${userId}`, jsonData, { ex: CACHE_TTL })
  );
}

export async function getCachedUserData(
  userId: string
): Promise<UserStore | null> {
  if (!redis) return null;

  try {
    const data = await safeRedisOperation(() => redis.get(`user:${userId}`));

    // Check if data exists and is a valid string that can be parsed
    if (!data) return null;

    // Additional type checking to handle different Redis client implementations
    if (typeof data === "object") {
      return data as UserStore; // Some Redis clients auto-parse JSON
    }

    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        console.error("Failed to parse Redis data");
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting cached user data:", error);
    return null;
  }
}

// Vector cache functions with error handling
export async function cacheVectorResults(
  key: string,
  results: Record<string, unknown> | string
): Promise<void> {
  if (!redis) return;

  // Make sure results are properly stringified
  const jsonResults =
    typeof results === "string" ? results : JSON.stringify(results);

  await safeRedisOperation(() =>
    redis.set(`vector:${key}`, jsonResults, { ex: CACHE_TTL })
  );
}

export async function getCachedVectorResults(
  key: string
): Promise<Record<string, unknown> | string | null> {
  if (!redis) return null;

  try {
    const data = await safeRedisOperation(() => redis.get(`vector:${key}`));

    // Check if data exists and is a valid string that can be parsed
    if (!data) return null;

    // Additional type checking to handle different Redis client implementations
    if (typeof data === "object") {
      return data as Record<string, unknown>; // Some Redis clients auto-parse JSON
    }

    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        // If it's already a string and not JSON, just return the string
        return data;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting cached vector results:", error);
    return null;
  }
}

// Function to generate a cache key for vector queries
export function generateVectorKey(query: string, userId?: string): string {
  // Create a deterministic key based on query content
  const normalizedQuery = query.toLowerCase().trim();
  return userId
    ? `${userId}:${normalizedQuery}`
    : `anonymous:${normalizedQuery}`;
}

// Clear user cache on update
export async function clearUserCache(userId: string): Promise<void> {
  if (!redis) return;
  await safeRedisOperation(() => redis.del(`user:${userId}`));
}

