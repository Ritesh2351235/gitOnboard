import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

const db = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const projects = await db.project.findMany({
        where: {
          userToProjects: {
            some: {
              userId: userId
            }
          }
        },
      });
      return res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 