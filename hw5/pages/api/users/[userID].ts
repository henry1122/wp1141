import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { userID } = req.query

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { userID: userID as string },
        include: {
          _count: {
            select: {
              posts: true,
              following: true,
              followers: true,
            },
          },
        },
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Check if current user follows this user
      let isFollowing = false
      if (session?.user?.id) {
        const follow = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: session.user.id,
              followingId: user.id,
            },
          },
        })
        isFollowing = !!follow
      }

      return res.status(200).json({
        user: {
          ...user,
          isFollowing,
          isOwnProfile: session?.user?.id === user.id,
        },
      })
    } catch (error) {
      console.error('Error fetching user:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'PATCH') {
    try {
      if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const user = await prisma.user.findUnique({
        where: { userID: userID as string },
      })

      if (!user || user.id !== session.user.id) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      const { bio, coverImage, image } = req.body

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(bio !== undefined && { bio }),
          ...(coverImage !== undefined && { coverImage }),
          ...(image !== undefined && { image }),
        },
      })

      return res.status(200).json({ user: updatedUser })
    } catch (error) {
      console.error('Error updating user:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}


