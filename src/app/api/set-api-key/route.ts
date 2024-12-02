import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { apiKey } = await req.json()
  
  if (!apiKey) {
    return new Response('API key is required', { status: 400 })
  }

  // Set the API key in an HTTP-only cookie
  cookies().set('openai-api-key', apiKey, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  })

  return new Response('API key set successfully', { status: 200 })
}

