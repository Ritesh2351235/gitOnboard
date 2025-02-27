
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server'

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req)

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    switch (req.method) {
      case 'GET':
        // Fetch all Kanban cards for the user
        const cards = await prisma.kanbanCard.findMany({
          where: { userId },
          orderBy: { createdAt: 'asc' },
        })
        return res.status(200).json(cards)

      case 'POST':
        // Create a new Kanban card
        const { title, description, type, repo, bounty, organization, url, status } = req.body

        if (!title || !type || !repo || !url || !status) {
          return res.status(400).json({ error: 'Missing required fields' })
        }

        const newCard = await prisma.kanbanCard.create({
          data: {
            title,
            description,
            type,
            repo,
            bounty,
            organization,
            url,
            status,
            userId,
          },
        })
        return res.status(201).json(newCard)

      case 'PUT':
        // Update an existing Kanban card
        const { id, ...updateData } = req.body

        if (!id) {
          return res.status(400).json({ error: 'Card ID is required' })
        }

        const updatedCard = await prisma.kanbanCard.update({
          where: { id },
          data: updateData,
        })
        return res.status(200).json(updatedCard)

      case 'DELETE':
        // Delete a Kanban card
        const cardId = req.query.id as string

        if (!cardId) {
          return res.status(400).json({ error: 'Card ID is required' })
        }

        await prisma.kanbanCard.delete({
          where: { id: cardId },
        })
        return res.status(204).end()

      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error in Kanban API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}