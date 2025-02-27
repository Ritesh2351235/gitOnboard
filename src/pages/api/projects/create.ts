import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';
import { indexGithubRepo } from '@/lib/githubloader';

const db = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { githubUrl, name } = req.body;
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Step 1: Create project in the database
    const project = await db.project.create({
      data: {
        githubUrl,
        name,
        userToProjects: {
          create: {
            userId: userId
          }
        }
      },
    });

    // Step 2: Process GitHub repo and store embeddings
    await indexGithubRepo(githubUrl, project.id); // Await the completion

    // Step 3: Send response after indexGithubRepo is done
    return res.status(201).json({
      message: `Project ${name} created with GitHub URL: ${githubUrl} and embeddings stored`,
      project
    });

  } catch (error) {
    // Fix: Ensure error is properly serialized for logging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error creating project:", { error: errorMessage });

    return res.status(500).json({ error: 'Failed to create project' });
  }
}