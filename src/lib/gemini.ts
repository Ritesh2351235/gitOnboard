import { GoogleGenerativeAI } from '@google/generative-ai';
import { Document } from '@langchain/core/documents';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Constants for text processing
const MAX_FILE_SIZE = 100 * 1024; // 100KB max file size for processing
const MAX_CODE_LENGTH = 10000;    // Gemini API limit for text input
const MAX_RETRIES = 2;            // Maximum retry attempts

/**
 * Simple rate limiter to control concurrent API calls.
 */
class RateLimiter {
  private queue: Array<() => Promise<void>> = [];
  private running = 0;
  private lastRequestTime = 0;

  constructor(private maxConcurrent: number, private minTimeBetweenMs: number) { }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const now = Date.now();
          const timeToWait = Math.max(0, this.lastRequestTime + this.minTimeBetweenMs - now);
          if (timeToWait > 0) {
            await new Promise(r => setTimeout(r, timeToWait));
          }
          this.lastRequestTime = Date.now();
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.running--;
          this.processQueue();
        }
      });
      this.processQueue();
    });
  }

  private processQueue() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) return;
    this.running++;
    const next = this.queue.shift();
    if (next) next();
  }
}

// Create rate limiters for different API endpoints
const contentRateLimiter = new RateLimiter(3, 300);   // 3 concurrent, 300ms between requests
const embeddingRateLimiter = new RateLimiter(5, 200);   // 5 concurrent, 200ms between requests

/**
 * Exponential backoff calculation with jitter.
 */
function exponentialBackoff(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const delay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
  return delay + (Math.random() * delay * 0.1);
}

/**
 * Check if the given content appears to be binary.
 */
function isBinaryContent(content: string): boolean {
  const sampleContent = content.slice(0, 1000);
  const nonPrintableCount = (sampleContent.match(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g) || []).length;
  return content.includes('\x00') || (nonPrintableCount > 50);
}

/**
 * Summarize code using the Gemini API with retries and error handling.
 */
export async function summarizeCode(doc: Document): Promise<string> {
  // Skip binary files
  if (isBinaryContent(doc.pageContent)) {
    return `File "${doc.metadata.source}" appears to be binary. No summary generated.`;
  }

  // Skip files that exceed the size limit
  if (doc.pageContent.length > MAX_FILE_SIZE) {
    return `File "${doc.metadata.source}" exceeds size limit (${doc.pageContent.length} bytes). No summary generated.`;
  }

  // Truncate code to API limit
  const code = doc.pageContent.slice(0, MAX_CODE_LENGTH);

  return contentRateLimiter.add(async () => {
    let retries = 0;
    while (true) {
      try {
        console.log(`Summarizing ${doc.metadata.source}`);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent([
          `You are an intelligent senior software developer and engineer who specializes in onboarding junior software engineers onto projects`,
          `You are onboarding a junior software engineer to a project and explaining the purpose of ${doc.metadata.source} to them.`,
          `Here is the code 
          ----
          ${code}
          ----
          Give the summary not more than 100 words.`
        ]);
        return response.response.text();
      } catch (error: any) {
        retries++;
        console.error(`Error summarizing ${doc.metadata.source} (attempt ${retries}/${MAX_RETRIES}):`, error);
        if (retries >= MAX_RETRIES) {
          return `Failed to summarize ${doc.metadata.source} after ${retries} attempts.`;
        }
        let backoffMs = exponentialBackoff(retries, 1000, 30000);
        if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
          console.log(`Rate limit hit, waiting ${backoffMs}ms before retry`);
        } else {
          backoffMs = Math.min(backoffMs, 5000);
        }
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }
  });
}

/**
 * Generate embeddings using the Gemini API with retries and error handling.
 */
export async function generateembeddings(summary: string): Promise<number[]> {
  return embeddingRateLimiter.add(async () => {
    let retries = 0;
    while (true) {
      try {
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const result = await model.embedContent(summary);
        return result.embedding.values;
      } catch (error: any) {
        retries++;
        console.error(`Error generating embedding (attempt ${retries}/${MAX_RETRIES}):`, error);
        if (retries >= MAX_RETRIES) {
          throw new Error(`Failed to generate embedding after ${MAX_RETRIES} attempts: ${error.message}`);
        }
        const backoffMs = exponentialBackoff(retries, 1000, 30000);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }
  });
}
