import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { id } = req.query

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: id as string,
        },
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })

      // Trigger Pusher event
      const Pusher = require('pusher')
      const pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID!,
        key: process.env.PUSHER_KEY!,
        secret: process.env.PUSHER_SECRET!,
        cluster: process.env.PUSHER_CLUSTER!,
        useTLS: true,
      })

      pusher.trigger('my-x-channel', 'like-updated', {
        postId: id,
        action: 'unliked',
      })

      return res.status(200).json({ liked: false })
    } else {
      // Like
      const like = await prisma.like.create({
        data: {
          userId: session.user.id,
          postId: id as string,
        },
      })

      // Get post to find author
      const post = await prisma.post.findUnique({
        where: { id: id as string },
        select: { authorId: true },
      })

      // Create notification
      if (post) {
        await createNotification(post.authorId, 'like', session.user.id, id as string)
      }

      // Trigger Pusher event
      const Pusher = require('pusher')
      const pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID!,
        key: process.env.PUSHER_KEY!,
        secret: process.env.PUSHER_SECRET!,
        cluster: process.env.PUSHER_CLUSTER!,
        useTLS: true,
      })

      pusher.trigger('my-x-channel', 'like-updated', {
        postId: id,
        action: 'liked',
      })

      return res.status(200).json({ liked: true })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


