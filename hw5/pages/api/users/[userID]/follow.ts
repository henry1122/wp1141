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

    const { userID } = req.query

    const userToFollow = await prisma.user.findUnique({
      where: { userID: userID as string },
    })

    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (userToFollow.id === session.user.id) {
      return res.status(400).json({ error: 'Cannot follow yourself' })
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userToFollow.id,
        },
      },
    })

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          id: existingFollow.id,
        },
      })

      return res.status(200).json({ isFollowing: false })
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: session.user.id,
          followingId: userToFollow.id,
        },
      })

      return res.status(200).json({ isFollowing: true })
    }
  } catch (error) {
    console.error('Error toggling follow:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


