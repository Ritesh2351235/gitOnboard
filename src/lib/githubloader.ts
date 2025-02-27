import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github';
import { Document } from '@langchain/core/documents';
import { summarizeCode, generateembeddings } from './gemini';
import { db } from '@/server/db';
import path from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const MAX_RETRIES = 2;
// Allowed file extensions for processing
const ALLOWED_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.py', '.rb', '.java', '.go', '.rs', '.c', '.cpp', '.cs',
  '.php', '.swift', '.kt', '.scala', '.sh', '.bash', '.html', '.css', '.scss', '.md',
  '.json', '.yml', '.yaml', '.toml', '.ini', '.env.example', '.gitignore'
];

// Patterns to ignore
const IGNORE_PATTERNS = [
  'node_modules/**', 'dist/**', 'build/**', '.next/**', 'out/**',
  'vendor/**', 'coverage/**', 'test/**', 'tests/**', '.git/**', '.github/**',
  'public/assets/**', 'public/images/**', 'public/static/**',
  '**/*.min.js', '**/*.bundle.js', '**/package-lock.json', '**/yarn.lock',
  '**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.ico',
  '**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.eot', '**/*.pdf', '**/*.zip'
];

// Batch processing and concurrency constants
const BATCH_SIZE = 30;   // Number of files to process in a batch
const CONCURRENCY = 3;   // Max concurrent API calls

/**
 * Simple exponential backoff function (same as in gemini.ts).
 */
function exponentialBackoff(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const delay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
  return delay + (Math.random() * delay * 0.1);
}

/**
 * Check if content appears to be binary.
 */
function isBinaryContent(content: string): boolean {
  const sampleContent = content.slice(0, 1000);
  const nonPrintableCount = (sampleContent.match(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g) || []).length;
  return content.includes('\x00') || (nonPrintableCount > 50);
}

/**
 * Load a GitHub repository with filtering for allowed extensions and file size.
 */
export const loadGithubRepo = async (githubUrl: string) => {
  console.log(`Loading GitHub repo: ${githubUrl}`);

  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: GITHUB_TOKEN || '',
    branch: 'main',
    ignoreFiles: IGNORE_PATTERNS,
    recursive: true,
    unknown: 'warn',
    maxConcurrency: 3,
  });

  try {
    // Load all documents
    const docs = await loader.load();
    console.log(`Loaded ${docs.length} files from ${githubUrl}`);

    // Filter documents based on allowed extensions
    const filteredDocs = docs.filter(doc => {
      const filePath = doc.metadata.source;
      const ext = path.extname(filePath).toLowerCase();
      return ALLOWED_EXTENSIONS.includes(ext);
    });

    console.log(`Filtered to ${filteredDocs.length} processable files`);
    return filteredDocs;
  } catch (error) {
    console.error(`Error loading GitHub repo ${githubUrl}:`, error);
    throw error;
  }
};


/**
 * Utility to perform a database operation with retries.
 */
async function databaseWriteWithRetry<T>(operation: () => Promise<T>): Promise<T> {
  let retries = 0;
  while (true) {
    try {
      return await operation();
    } catch (error: any) {
      retries++;
      if (retries >= MAX_RETRIES) {
        console.error(`Database operation failed after ${MAX_RETRIES} retries:`, error);
        throw error;
      }
      const isConnectionError =
        error.message?.includes('connection pool') ||
        error.message?.includes('Timed out') ||
        error.code === 'P2024';

      if (!isConnectionError) {
        console.error('Non-connection database error:', error);
        throw error;
      }
      const backoffMs = exponentialBackoff(retries, 500, 10000);
      console.log(`Database connection error, retrying in ${backoffMs}ms (attempt ${retries}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
  }
}

/**
 * Process documents in chunks with optional progress tracking.
 */
async function processDocsInChunks(
  docs: Document[],
  updateProgressCallback?: (progress: number) => void
) {
  const results: any[] = [];
  let completed = 0;
  const totalBatches = Math.ceil(docs.length / BATCH_SIZE);

  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const start = batchIndex * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, docs.length);
    const batch = docs.slice(start, end);

    console.log(`Processing batch ${batchIndex + 1}/${totalBatches} (files ${start + 1}-${end} of ${docs.length})`);

    for (let i = 0; i < batch.length; i += CONCURRENCY) {
      const concurrentBatch = batch.slice(i, i + CONCURRENCY);
      const concurrentResults = await Promise.allSettled(
        concurrentBatch.map(async (doc) => {
          try {
            console.log(`Processing ${doc.metadata.source}`);
            const summary = await summarizeCode(doc);
            let embedding: number[] = [];
            if (summary && !summary.includes('Failed to summarize') && !summary.includes('No summary generated')) {
              embedding = await generateembeddings(summary);
            }
            completed++;
            if (updateProgressCallback) {
              updateProgressCallback(Math.round((completed / docs.length) * 100));
            }
            return {
              summary,
              embedding,
              sourceCode: doc.pageContent, // Pass sourceCode as-is
              fileName: doc.metadata.source
            };
          } catch (error) {
            console.error(`Error processing ${doc.metadata.source}:`, error);
            completed++;
            if (updateProgressCallback) {
              updateProgressCallback(Math.round((completed / docs.length) * 100));
            }
            throw error;
          }
        })
      );
      for (const result of concurrentResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        }
      }
    }

    if (batchIndex < totalBatches - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return results;
}

/**
 * Store generated embeddings in the database with retry logic.
 */
async function storeEmbeddingsInDatabase(
  embeddings: Array<{
    summary: string;
    embedding: number[];
    sourceCode: string;
    fileName: string;
  }>,
  projectId: string
) {
  const results = { success: 0, failed: 0 };
  const STORAGE_BATCH_SIZE = 15;

  for (let i = 0; i < embeddings.length; i += STORAGE_BATCH_SIZE) {
    const batch = embeddings.slice(i, i + STORAGE_BATCH_SIZE);
    const batchPromises = batch.map(async (item) => {
      if (!item.embedding || item.embedding.length === 0) {
        console.log(`Skipping ${item.fileName} - no valid embedding`);
        results.failed++;
        return;
      }
      try {
        await databaseWriteWithRetry(async () => {
          const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data: {
              summary: item.summary,
              sourceCode: item.sourceCode, // Store sourceCode as-is
              fileName: item.fileName,
              projectId: projectId,
            },
          });
          await db.$executeRaw`
            UPDATE "sourceCodeEmbedding"
            SET "SummaryEmbedding" = ${item.embedding}::vector
            WHERE "id" = ${sourceCodeEmbedding.id}
          `;
        });
        results.success++;
      } catch (error) {
        console.error(`Failed to store embedding for ${item.fileName}:`, error);
        results.failed++;
      }
    });
    await Promise.allSettled(batchPromises);
    if (i + STORAGE_BATCH_SIZE < embeddings.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  return results;
}

/**
 * Main function to index a GitHub repository.
 */
export const indexGithubRepo = async (
  githubUrl: string,
  ProjectId: string,
  githubToken?: string,
  progressCallback?: (progress: number) => void
) => {
  console.log(`Starting indexing of GitHub repo: ${githubUrl}`);
  try {
    // Load and filter documents from GitHub
    const docs = await loadGithubRepo(githubUrl);
    console.log(`Retrieved ${docs.length} documents from GitHub`);

    if (docs.length === 0) {
      console.log('No documents found to process');
      return { success: true, filesProcessed: 0, totalFiles: 0 };
    }

    // Process smaller files first
    docs.sort((a, b) => a.pageContent.length - b.pageContent.length);

    console.log(`Generating embeddings for ${docs.length} files`);
    const allEmbeddings = await processDocsInChunks(docs, progressCallback);
    console.log(`Successfully generated ${allEmbeddings.length} embeddings`);

    console.log('Storing embeddings in database...');
    const storageResults = await storeEmbeddingsInDatabase(allEmbeddings, ProjectId);
    console.log(`Indexing complete: ${storageResults.success} files stored successfully, ${storageResults.failed} failed`);

    return {
      success: true,
      filesProcessed: storageResults.success,
      failedFiles: storageResults.failed,
      totalFiles: docs.length
    };
  } catch (error) {
    console.error(`Error indexing GitHub repo:`, error);
    throw error;
  }
};

/**
 * Convenience function to process documents into embeddings.
 */
export const generateEmbeddings = async (docs: Document[]) => {
  const processed = await processDocsInChunks(docs);
  return processed;
};
