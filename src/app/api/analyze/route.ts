import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      return new Response('No image provided', { status: 400 })
    }

    const imageData = await image.arrayBuffer()
    const base64Image = Buffer.from(imageData).toString('base64')

    const prompt = `
      Analyze this kana homework image and provide:
      1. Detailed feedback on the student's writing
      2. A follow-up exercise recommendation
      3. Identify which kana systems (hiragana/katakana) are used
      4. List all unique characters present
    `

    const { text } = await generateText({
      model: openai('gpt-4-vision'),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image', image: `data:image/jpeg;base64,${base64Image}` }
          ]
        }
      ]
    })

    // Process the response and return structured data
    return new Response(JSON.stringify({
      analysis: {
        // This would be parsed from the AI response
        hiragana: true,
        katakana: false,
        columns: ['あ', 'か', 'さ', 'た', 'な'],
        characters: ['あ', 'い', 'う', 'え', 'お']
      },
      feedback: {
        feedback: text,
        followUpExercise: "Practice writing the following characters...",
        practiceWords: ["あい", "さけ", "たて", "なに"]
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error processing image:', error)
    return new Response('Error processing image', { status: 500 })
  }
}

