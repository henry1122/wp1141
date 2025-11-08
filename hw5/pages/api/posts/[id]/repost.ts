import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // Check if already reposted
    const existingRepost = await prisma.repost.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: id as string,
        },
      },
    })

    if (existingRepost) {
      // Undo repost
      await prisma.repost.delete({
        where: {
          id: existingRepost.id,
        },
      })

      // Trigger Pusher event
      try {
        const Pusher = require('pusher')
        const pusher = new Pusher({
          appId: process.env.PUSHER_APP_ID!,
          key: process.env.PUSHER_KEY!,
          secret: process.env.PUSHER_SECRET!,
          cluster: process.env.PUSHER_CLUSTER!,
          useTLS: true,
        })

        pusher.trigger('my-x-channel', 'repost-updated', {
          postId: id,
          action: 'unreposted',
        })
      } catch (pusherError) {
        console.error('Pusher error:', pusherError)
      }

      return res.status(200).json({ success: true, reposted: false })
    }

    // Create repost
    await prisma.repost.create({
      data: {
        userId: session.user.id,
        postId: id as string,
      },
    })

    // Trigger Pusher event
    try {
      const Pusher = require('pusher')
      const pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID!,
        key: process.env.PUSHER_KEY!,
        secret: process.env.PUSHER_SECRET!,
        cluster: process.env.PUSHER_CLUSTER!,
        useTLS: true,
      })

      pusher.trigger('my-x-channel', 'repost-updated', {
        postId: id,
        action: 'reposted',
      })
    } catch (pusherError) {
      console.error('Pusher error:', pusherError)
    }

    return res.status(200).json({ success: true, reposted: true })
  } catch (error) {
    console.error('Error creating repost:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


