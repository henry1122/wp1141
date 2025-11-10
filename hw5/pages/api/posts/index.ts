import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (req.method === 'GET') {
    try {
      const { type = 'all', limit = 20, offset = 0 } = req.query

      let posts

      if (type === 'following' && session?.user?.id) {
        // Get users that the current user follows
        const following = await prisma.follow.findMany({
          where: { followerId: session.user.id },
          select: { followingId: true },
        })

        const followingIds = following.map((f) => f.followingId)

        posts = await prisma.post.findMany({
          where: {
            OR: [
              { authorId: { in: followingIds } },
              {
                reposts: {
                  some: {
                    userId: { in: followingIds },
                  },
                },
              },
            ],
            parentPostId: null, // Only top-level posts
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
          take: parseInt(limit as string),
          skip: parseInt(offset as string),
        })
      } else {
        posts = await prisma.post.findMany({
          where: {
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
          take: parseInt(limit as string),
          skip: parseInt(offset as string),
        })
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

        posts = posts.map((post) => ({
          ...post,
          liked: likedSet.has(post.id),
          reposted: repostedSet.has(post.id),
        }))
      } else {
        // Add default values if not logged in
        posts = posts.map((post) => ({
          ...post,
          liked: false,
          reposted: false,
        }))
      }

      return res.status(200).json({ posts })
    } catch (error) {
      console.error('Error fetching posts:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'POST') {
    try {
      if (!session?.user?.id) {
        console.error('POST /api/posts: No session or user ID')
        return res.status(401).json({ error: 'Unauthorized: Please sign in first' })
      }

      const { content, imageUrl, parentPostId } = req.body

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'Content is required' })
      }

      const processedContent = processPostContent(content.trim())

      if (processedContent.length > 280) {
        return res.status(400).json({ error: 'Post exceeds character limit (280 characters)' })
      }

      console.log('Creating post:', { 
        authorId: session.user.id, 
        contentLength: processedContent.content.length,
        parentPostId: parentPostId || null 
      })

      const post = await prisma.post.create({
        data: {
          content: processedContent.content,
          authorId: session.user.id,
          imageUrl: imageUrl || null,
          parentPostId: parentPostId || null,
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
      })

      // Trigger Pusher event (API routes are always server-side)
      try {
        const Pusher = require('pusher')
        const pusher = new Pusher({
          appId: process.env.PUSHER_APP_ID!,
          key: process.env.PUSHER_KEY!,
          secret: process.env.PUSHER_SECRET!,
          cluster: process.env.PUSHER_CLUSTER!,
          useTLS: true,
        })

        if (parentPostId) {
          // This is a comment - get updated comment count
          const commentCount = await prisma.post.count({
            where: { parentPostId: post.parentPostId || parentPostId },
          })
          
          console.log('Triggering new-comment event for parentPostId:', parentPostId, 'commentCount:', commentCount)
          
          pusher.trigger('my-x-channel', 'new-comment', {
            post: {
              ...post,
              liked: false,
              reposted: false,
            },
            parentPostId: parentPostId,
            commentCount: commentCount,
          })
        } else {
          // This is a new post
          pusher.trigger('my-x-channel', 'new-post', {
            post: {
              ...post,
              liked: false,
              reposted: false,
            },
          })
        }
      } catch (pusherError) {
        console.error('Pusher error:', pusherError)
        // Continue even if Pusher fails
      }

      return res.status(201).json({ post })
    } catch (error) {
      console.error('Error creating post:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

function processPostContent(content: string): { content: string; length: number } {
  // Extract URLs (simple regex)
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const urls = content.match(urlRegex) || []
  
  // Extract hashtags and mentions (don't count toward limit)
  const hashtagRegex = /#\w+/g
  const mentionRegex = /@\w+/g
  
  // Calculate base length (without hashtags and mentions)
  let baseContent = content
    .replace(hashtagRegex, '')
    .replace(mentionRegex, '')
    .trim()
  
  // Each URL counts as 23 characters
  let effectiveLength = baseContent.length
  urls.forEach(() => {
    effectiveLength += 23
  })

  return {
    content,
    length: effectiveLength,
  }
}

