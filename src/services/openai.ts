import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from "openai/helpers/zod";
import { resizeImage } from '../utils/imageUtils';
import { createCacheKey } from '../utils/cacheUtils';

const homeworkAnalysisSchema = z.object({
  feedback: z.string().describe('Detailed feedback on the writing, including any errors or areas for improvement'),
  words: z.array(z.string()).describe('List of all kana words that appear in the homework')
});

type HomeworkFeedback = z.infer<typeof homeworkAnalysisSchema>;

const CACHE_NAME = 'kana-homework-analysis';

async function analyzeImageWithOpenAI(file: File, apiKey: string): Promise<HomeworkFeedback> {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  // Resize the image before sending
  const base64Image = await resizeImage(file);

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this Japanese kana homework assignment. Provide detailed feedback on the writing, including any errors or areas for improvement. Format your feedback in markdown, using headings, bullet points, and emphasis where appropriate. Also identify all the words that appear in the homework."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }
    ],
    response_format: zodResponseFormat(homeworkAnalysisSchema, "analysis")
  });

  const message = response.choices[0]?.message;
  if (!message) {
    throw new Error("No response received from OpenAI");
  }
  if (message.refusal) {
    throw new Error(`AI refused to generate content: ${message.refusal}`);
  }
  const feedback = message.parsed as HomeworkFeedback | undefined;
  if (!feedback) {
    throw new Error("Invalid response format from OpenAI");
  }
  return feedback;
}

export async function analyzeImage(file: File, apiKey: string): Promise<HomeworkFeedback> {
  try {
    // Get or create the cache
    const cache = await caches.open(CACHE_NAME);
    
    // Generate cache key based on file content and schema
    const cacheKey = await createCacheKey(file, homeworkAnalysisSchema);
    
    // Try to get the cached response
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      const cachedData = await cachedResponse.json();
      return cachedData as HomeworkFeedback;
    }
    
    // If not in cache, analyze the image
    const analysis = await analyzeImageWithOpenAI(file, apiKey);
    
    // Cache the result
    await cache.put(
      cacheKey,
      new Response(JSON.stringify(analysis), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
        }
      })
    );
    
    return analysis;
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Handle rate limiting error specifically
    if (error instanceof Error && error.message.includes('rate limit exceeded')) {
      throw new Error('API rate limit exceeded. Please try again in about an hour.');
    }
    
    throw new Error('Failed to analyze image');
  }
}
