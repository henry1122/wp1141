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
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Get users that this user follows
      const follows = await prisma.follow.findMany({
        where: { followerId: user.id },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              userID: true,
              image: true,
            },
          },
        },
      })

      const following = follows.map((f) => f.following)

      return res.status(200).json({ following })
    } catch (error) {
      console.error('Error fetching following:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

