// Utility function to manage OpenAI API key in localStorage
// Note: In a production environment, consider using more secure storage methods

export function setApiKey(apiKey: string): void {
  if (!apiKey) {
    throw new Error('API key is required')
  }
  
  // Store the API key in localStorage
  localStorage.setItem('openai-api-key', apiKey)
}

export function getApiKey(): string | null {
  return localStorage.getItem('openai-api-key')
}

export function removeApiKey(): void {
  localStorage.removeItem('openai-api-key')
}
