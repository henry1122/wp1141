import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (req.method === 'GET') {
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const notifications = await prisma.notification.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              userID: true,
              image: true,
            },
          },
          post: {
            select: {
              id: true,
              content: true,
              imageUrl: true,
              videoUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      })

      return res.status(200).json({ notifications })
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'PATCH') {
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const { notificationId, read } = req.body

      if (notificationId) {
        // Mark single notification as read
        await prisma.notification.update({
          where: { id: notificationId },
          data: { read: true },
        })
      } else {
        // Mark all notifications as read
        await prisma.notification.updateMany({
          where: {
            userId: session.user.id,
            read: false,
          },
          data: {
            read: true,
          },
        })
      }

      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error updating notification:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

