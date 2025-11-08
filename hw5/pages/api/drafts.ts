import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const drafts = await prisma.draft.findMany({
        where: { authorId: session.user.id },
        orderBy: { updatedAt: 'desc' },
      })

      return res.status(200).json({ drafts })
    } catch (error) {
      console.error('Error fetching drafts:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { content, imageUrl } = req.body

      const draft = await prisma.draft.create({
        data: {
          content: content || '',
          imageUrl: imageUrl || null,
          authorId: session.user.id,
        },
      })

      return res.status(201).json({ draft })
    } catch (error) {
      console.error('Error creating draft:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query

      await prisma.draft.delete({
        where: { id: id as string },
      })

      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error deleting draft:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}


