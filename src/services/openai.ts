import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { resizeImage } from '../utils/imageUtils';
import { sha256 } from '../utils/cacheUtils';
import { createCacheRequest, getCache } from '../utils/cache';

const USER_PROMPT = `
The attached image is a scan of a homework assignment of kana. Your task is to analyze the image and provide feedback to the user.
In the image, the instructions are typeset. The user response is handwritten. Correct the user resonse, not the typeset material.

- Provide general feedback on the kana homework image, such as positive reinforcement and encouragement.
- Analyze the image to identify any mismatches between the kana and their romanizations. Provide corrections and explain why the corrected romanizations are accurate based on Japanese phonetic rules.
- Using the kana and romanizations in the image, provide simple Japanese words or sentences that include these kana. Include the English meanings to reinforce understanding.
- Create mnemonic devices for each mistaken kana in the image to help learners remember their pronunciations. For example, relate the shape of the kana to an English word or sound.
- Describe patterns or visual cues in the mistaken kana from the image that might help the learner distinguish and remember them. For example, explain how similar-looking kana can be differentiated.
- Create a set of practice questions that match the format in the image. Use the same format; for example, if the homework asks the user to write the romaji for kana, the follow-up exercises should do the same. Use the kana that appear in the image, or other kana in the same column of the gojuon. Don't give away the answer - if you are asking the student for romaji, don't also show it to them. 
`

const homeworkAnalysisSchema = z.object({
  kanaWords: z.array(z.string()).describe('List of all kana words that appear in the homework'),
  gojuonAreas: z.string().describe('List of gojuon columns that appear in the homework'),
  learningGoals: z.array(z.string()).describe('List of learning goals the this homework appears to be trying to address'),
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
  followUpExercises: z.array(z.string()).describe('Follow-up exercise for the user to practice the kana in the homework image'),
});

export type HomeworkFeedback = z.infer<typeof homeworkAnalysisSchema>;

type ChatCompletionFunctionParam = Parameters<typeof OpenAI.prototype.beta.chat.completions.parse>[0];

async function callAndParseCompletion<T>(apiKey: string, params: ChatCompletionFunctionParam): Promise<T> {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  const response = await openai.beta.chat.completions.parse(params);
  const message = response.choices[0]?.message;
  if (!message) {
    throw new Error("No response received from OpenAI");
  }
  if (message.refusal) {
    throw new Error(`AI refused to generate content: ${message.refusal}`);
  }
  const feedback = message.parsed as T | undefined;
  if (!feedback) {
    throw new Error("Invalid response format from OpenAI");
  }
  return feedback;
}

async function cachedOpenAIResponseCall<T>(apiKey: string, params: ChatCompletionFunctionParam): Promise<T> {
  const cache = await getCache();
  const cacheKey = await sha256(JSON.stringify(params));
  const cacheRequest = createCacheRequest(cacheKey);
  const cachedResponse = cache ? await cache.match(cacheRequest) : null;
  if (cachedResponse) {
    const data = await cachedResponse.json();
    return data as T;
  }
  const result = await callAndParseCompletion<T>(apiKey, params);

  if (cache) {
    try {
      const cacheRequest = createCacheRequest(cacheKey);
      const response = new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Key": cacheKey,
        },
      });
      await cache.put(cacheRequest, response);
    } catch (error) {
      console.error("Failed to store in cache:", error);
    }
  }

  return result;
}

export async function analyzeImage(file: File, apiKey: string): Promise<HomeworkFeedback> {
  const base64Image = await resizeImage(file);
  const params: ChatCompletionFunctionParam = {
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
  }
  return cachedOpenAIResponseCall(apiKey, params);
}