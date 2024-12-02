import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { resizeImage } from '../utils/imageUtils';
import { createCacheKey } from '../utils/cacheUtils';

const USER_PROMPT = `
1. Provide general feedback on the kana homework image, such as positive reinforcement and encouragement.
2. Analyze the image to identify any mismatches between the kana and their romanizations. Provide corrections and explain why the corrected romanizations are accurate based on Japanese phonetic rules.
3. Using the kana and romanizations in the image, provide simple Japanese words or sentences that include these kana. Include the English meanings to reinforce understanding.
4. Create mnemonic devices for each mistaken kana in the image to help learners remember their pronunciations. For example, relate the shape of the kana to an English word or sound.
5. Describe patterns or visual cues in the mistaken kana from the image that might help the learner distinguish and remember them. For example, explain how similar-looking kana can be differentiated.
`

const homeworkAnalysisSchema = z.object({
  generalFeedback: z.string().describe('General feedback on the homework with positive reinforcement.'),
  kanaRomanizationMismatches: z.array(z.object({
    kana: z.string(),
    romanization: z.string(),
    correction: z.string(),
    explanation: z.string()
  })).describe('List of kana and their romanization mismatches'),
  sampleWordsAndSentences: z.array(z.string()).describe('List of sample words and sentences that use the kana in the homework image'),
  mnemonicDevices: z.array(z.string()).describe('List of mnemonic devices for each kana in the homework image').optional(), 
  visualPatterns: z.array(z.string()).describe('List of visual patterns in the homework image').optional(), 
  words: z.array(z.string()).describe('List of all kana words that appear in the homework')
});

export type HomeworkFeedback = z.infer<typeof homeworkAnalysisSchema>;

const CACHE_NAME = 'kana-homework-analysis';

async function analyzeImageWithOpenAI(file: File, apiKey: string): Promise<HomeworkFeedback> {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  // Resize the image before sending
  const base64Image = await resizeImage(file);

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant who can analyze kana homework images."
      },
      {
        role: "user",
        content: [
          { type: "text", text: USER_PROMPT },
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
  const cacheKey = await createCacheKey(file, USER_PROMPT, homeworkAnalysisSchema);
  const cachedResult = localStorage.getItem(`${CACHE_NAME}-${cacheKey}`);
  
  if (cachedResult) {
    try {
      return JSON.parse(cachedResult) as HomeworkFeedback;
    } catch (error) {
      console.warn("Failed to parse cached result:", error);
    }
  }

  const result = await analyzeImageWithOpenAI(file, apiKey);
  
  try {
    localStorage.setItem(`${CACHE_NAME}-${cacheKey}`, JSON.stringify(result));
  } catch (error) {
    console.warn("Failed to cache analysis result:", error);
  }

  return result;
}
