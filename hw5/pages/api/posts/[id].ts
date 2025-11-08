import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const post = await prisma.post.findUnique({
        where: { id: id as string },
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
              comments: true,
              likes: true,
              reposts: true,
            },
          },
          childPosts: {
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
                  comments: true,
                  likes: true,
                  reposts: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      })

      if (!post) {
        return res.status(404).json({ error: 'Post not found' })
      }

      // Check if user has liked/reposted
      let liked = false
      let reposted = false

      if (session?.user?.id) {
        const [like, repost] = await Promise.all([
          prisma.like.findUnique({
            where: {
              userId_postId: {
                userId: session.user.id,
                postId: post.id,
              },
            },
          }),
          prisma.repost.findUnique({
            where: {
              userId_postId: {
                userId: session.user.id,
                postId: post.id,
              },
            },
          }),
        ])

        liked = !!like
        reposted = !!repost
      }

      return res.status(200).json({
        post: {
          ...post,
          liked,
          reposted,
        },
      })
    } catch (error) {
      console.error('Error fetching post:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const post = await prisma.post.findUnique({
        where: { id: id as string },
      })

      if (!post) {
        return res.status(404).json({ error: 'Post not found' })
      }

      if (post.authorId !== session.user.id) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      await prisma.post.delete({
        where: { id: id as string },
      })

      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error deleting post:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}


