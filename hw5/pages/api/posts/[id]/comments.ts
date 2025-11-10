import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const comments = await prisma.post.findMany({
        where: { parentPostId: id as string },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              userID: true,
              image: true,
            },
          },
          _count: {
            select: {
              childPosts: true, // Comments are stored as child posts
              likes: true,
              reposts: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      // Check if user has liked/reposted
      if (session?.user?.id) {
        const commentIds = comments.map((c) => c.id)
        const [likes, reposts] = await Promise.all([
          prisma.like.findMany({
            where: {
              userId: session.user.id,
              postId: { in: commentIds },
            },
          }),
          prisma.repost.findMany({
            where: {
              userId: session.user.id,
              postId: { in: commentIds },
            },
          }),
        ])

        const likedSet = new Set(likes.map((l) => l.postId))
        const repostedSet = new Set(reposts.map((r) => r.postId))

        const commentsWithStatus = comments.map((comment) => ({
          ...comment,
          liked: likedSet.has(comment.id),
          reposted: repostedSet.has(comment.id),
        }))

        return res.status(200).json({ comments: commentsWithStatus })
      }

      return res.status(200).json({ comments })
    } catch (error) {
      console.error('Error fetching comments:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}


