# Caching in Kana Homework Helper

The application uses the browser's Cache API to store OpenAI responses for faster subsequent analyses of the same images. This helps reduce API costs and improves response times for previously analyzed homework submissions.

## Cache Implementation

- Cache responses are stored using the browser's Cache API under the cache name `openai-responses-v1`
- Cache keys are generated using SHA-256 hashes of:
  - The image file content
  - The user prompt
  - The analysis schema

## Disabling the Cache

The cache can be disabled in two ways:

1. **URL Parameter**: Add `#no-cache` to the URL
   ```
   https://example.com/kana-helper#no-cache
   ```

2. **Development**: The cache is automatically disabled when running in development mode with `npm run dev`

## Cache Invalidation

The cache is versioned using the `CACHE_NAME` constant in `src/utils/cache.ts`. To invalidate all cached responses, increment the version number in the cache name (e.g., from `openai-responses-v1` to `openai-responses-v2`).
