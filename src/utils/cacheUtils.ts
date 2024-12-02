/**
 * Generates a SHA-256 hash of the input string
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Creates a cache key URL for the given file and schema
 */
export async function createCacheKey(file: File, userPrompt: string, schema: unknown): Promise<string> {
  // Read the file as ArrayBuffer
  const fileContent = await file.arrayBuffer();
  // Convert ArrayBuffer to Base64
  const fileBase64 = btoa(
    new Uint8Array(fileContent).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  
  // Create hashes of both the file content and schema
  const fileHash = await sha256(fileBase64);
  const userPromptHash = await sha256(userPrompt);
  const schemaHash = await sha256(JSON.stringify(schema));
  const cacheKey = await sha256(`${fileHash}${userPromptHash}${schemaHash}`);
  
  // Combine hashes into a fictitious URL
  return `https://cache.kana-helper.local/analysis/${cacheKey}`;
}
