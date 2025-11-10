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
              childPosts: true, // Comments are stored as child posts
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
                  childPosts: true, // Comments are stored as child posts
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
      console.log('[DELETE Post] Starting delete request for post:', id)
      console.log('[DELETE Post] Session:', session ? 'exists' : 'missing', 'User ID:', session?.user?.id)
      
      if (!session?.user?.id) {
        console.log('[DELETE Post] Unauthorized: No session or user ID')
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const post = await prisma.post.findUnique({
        where: { id: id as string },
      })

      console.log('[DELETE Post] Post found:', !!post, 'Post authorId:', post?.authorId, 'Session user.id:', session.user.id)

      if (!post) {
        console.log('[DELETE Post] Post not found')
        return res.status(404).json({ error: 'Post not found' })
      }

      // Convert both to strings for comparison to handle ObjectId type issues
      const postAuthorId = String(post.authorId)
      const sessionUserId = String(session.user.id)
      
      console.log('[DELETE Post] Comparing authorId:', postAuthorId, 'with session userId:', sessionUserId)

      if (postAuthorId !== sessionUserId) {
        console.log('[DELETE Post] Forbidden: User is not the author')
        return res.status(403).json({ error: 'Forbidden' })
      }

      console.log('[DELETE Post] Attempting to delete post')
      await prisma.post.delete({
        where: { id: id as string },
      })

      console.log('[DELETE Post] Post deleted successfully')
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('[DELETE Post] Error deleting post:', error)
      if (error instanceof Error) {
        console.error('[DELETE Post] Error message:', error.message)
        console.error('[DELETE Post] Error stack:', error.stack)
        return res.status(500).json({ 
          error: 'Internal server error',
          message: error.message 
        })
      }
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}


