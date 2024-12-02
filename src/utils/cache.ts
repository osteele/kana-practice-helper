// Cache name for storing OpenAI responses
const CACHE_NAME = "openai-responses-v1";

// Helper function to get or create cache
export async function getCache(): Promise<Cache|null> {
  if ("caches" in window) {
    return await caches.open(CACHE_NAME);
  }
  console.warn("Cache API is not supported in this environment");
  return null;
}

// Helper function to create a cache request
export function createCacheRequest(cacheKey: string): Request {
  return new Request(`https://api.local/cache/${cacheKey}`, {
    method: "GET",
    headers: {
      "Cache-Key": cacheKey,
    },
  });
}
