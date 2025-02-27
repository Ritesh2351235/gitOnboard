'use server'

import { streamText } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateembeddings } from '@/lib/gemini';
import { db } from '@/server/db';
import { GitHubRepoAnalyzer } from '@/lib/repodetails';
import { Contributor } from '@/app/(protected)/dashboard/types';



const githubToken = process.env.GITHUB_TOKEN;
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

interface RepoAnalysis {
  fileStructure: Array<{ path: string; type: string }>;
  issues: {
    active: Array<{ number: number; title: string; url: string; author: Contributor }>;
    goodFirstIssues: Array<{ number: number; title: string; url: string; author: Contributor }>;
    helpWantedIssues: Array<{ number: number; title: string; url: string; author: Contributor }>;
  };
  pullRequests: Array<{
    number: number;
    title: string;
    url: string;
    state: string;
    description: string;
    author: Contributor;
  }>;
  topContributors: Contributor[];
}

export async function askQuestion(question: string, projectId: string) {

  const stream = createStreamableValue();

  const queryVector = await generateembeddings(question);
  const vectorQuery = `[${queryVector.join(',')}]`;

  const result = await db.$queryRaw`
  SELECT "fileName", "summary", "sourceCode",
  1 - ("SummaryEmbedding" <=> ${vectorQuery} :: vector) AS similarity
  FROM "sourceCodeEmbedding"
  WHERE 1 - ("SummaryEmbedding" <=> ${vectorQuery} :: vector) > 0.5 AND "projectId" = ${projectId}
  ORDER BY similarity DESC
  LIMIT 10
  ` as { fileName: string, summary: string, sourceCode: string }[];

  let context = '';
  for (const doc of result) {
    context += `source: ${doc.fileName}\nsummary of the file: ${doc.summary}\ncode content: ${doc.sourceCode}\n\n`;
  }

  (async () => {
    const { textStream } = await streamText({
      model: google('gemini-1.5-flash'),
      prompt: `
      You are a AI code assistant who answers questions about the codebase. Your target audience is a technical intern.
        AI assistant is a brand new, powerful, human-like artificial intelligence.
        The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
        AI is a well-behaved and well-mannered individual.
        AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in the codebase.
        If the question is asking about code or a specific file, AI will provide the detailed answer, giving step-by-step instructions.
        
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK

        START QUESTION
        ${question}
        END OF QUESTION

        AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
        If the context does not provide the answer to the question, the AI assistant will say, "I'm sorry, but I don't know the answer."
        AI assistant will not apologize for previous responses, but instead will indicate when new information was gained.
        AI assistant will not invent anything that is not drawn directly from the context.
        Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering.
        `,

    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })()

  return {
    output: stream.value,
    fileReferenced: result
  }
}

export async function analyzeGitHubRepository(owner: string, repo: string) {
  if (!githubToken) {
    throw new Error('GitHub token is not defined. Please set the GITHUB_TOKEN environment variable.');
  }
  try {
    console.log(`Starting analysis of ${owner}/${repo}...`);

    const analyzer = new GitHubRepoAnalyzer(githubToken, owner, repo);

    // Get all repository information
    const analysis = await analyzer.analyzeRepository();

    return analysis;
  } catch (error) {
    console.error('❌ Error during analysis:', error);
  }
}

