import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { userID } = req.query
  const { type = 'posts' } = req.query

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { userID: userID as string },
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      let posts

      if (type === 'likes') {
        // Get posts that user has liked (only if viewing own profile)
        if (session?.user?.id !== user.id) {
          return res.status(403).json({ error: 'Forbidden' })
        }

        const likes = await prisma.like.findMany({
          where: { userId: user.id },
          include: {
            post: {
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
            },
          },
          orderBy: { createdAt: 'desc' },
        })

        posts = likes.map((like) => like.post)
      } else {
        // Get user's posts and reposts
        const [userPosts, reposts] = await Promise.all([
          prisma.post.findMany({
            where: {
              authorId: user.id,
              parentPostId: null,
            },
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
          }),
          prisma.repost.findMany({
            where: { userId: user.id },
            include: {
              post: {
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
              },
            },
            orderBy: { createdAt: 'desc' },
          }),
        ])

        posts = [
          ...userPosts.map((p) => ({ ...p, isRepost: false })),
          ...reposts.map((r) => ({ ...r.post, isRepost: true })),
        ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      }

      // Check if user has liked/reposted
      if (session?.user?.id) {
        const postIds = posts.map((p) => p.id)
        const [likes, reposts] = await Promise.all([
          prisma.like.findMany({
            where: {
              userId: session.user.id,
              postId: { in: postIds },
            },
          }),
          prisma.repost.findMany({
            where: {
              userId: session.user.id,
              postId: { in: postIds },
            },
          }),
        ])

        const likedSet = new Set(likes.map((l) => l.postId))
        const repostedSet = new Set(reposts.map((r) => r.postId))

        posts = posts.map((post: any) => ({
          ...post,
          liked: likedSet.has(post.id),
          reposted: repostedSet.has(post.id),
          isRepost: post.isRepost || false,
        }))
      } else {
        // Add default values if not logged in
        posts = posts.map((post: any) => ({
          ...post,
          liked: false,
          reposted: false,
          isRepost: post.isRepost || false,
        }))
      }

      // Ensure all posts have required fields
      const formattedPosts = posts.map((post) => ({
        id: post.id,
        content: post.content || '',
        author: post.author || {
          id: '',
          name: 'Unknown',
          userID: 'unknown',
          image: null,
        },
        createdAt: post.createdAt,
        imageUrl: post.imageUrl || null,
        _count: post._count || {
          comments: 0,
          likes: 0,
          reposts: 0,
        },
        liked: post.liked || false,
        reposted: post.reposted || false,
        isRepost: post.isRepost || false,
      }))

      return res.status(200).json({ posts: formattedPosts })
    } catch (error) {
      console.error('Error fetching user posts:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}


