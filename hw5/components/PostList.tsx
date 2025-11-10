import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PostCard from './PostCard'
import { pusherClient } from '@/lib/pusher'

interface PostListProps {
  type?: 'all' | 'following'
  userID?: string
  postType?: 'posts' | 'likes'
}

export default function PostList({ type = 'all', userID, postType = 'posts' }: PostListProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchPosts = async () => {
    setLoading(true)
    try {
      let url = '/api/posts'
      if (userID) {
        url = `/api/users/${userID}/posts?type=${postType}`
      } else {
        url = `/api/posts?type=${type}`
      }

      const res = await fetch(url, {
        credentials: 'include', // Include cookies for session
      })
      
      if (!res.ok) {
        console.error('Failed to fetch posts:', res.status, res.statusText)
        const errorData = await res.json().catch(() => ({}))
        console.error('Error data:', errorData)
        setPosts([])
        return
      }
      
      const data = await res.json()
      console.log('Fetched posts:', data.posts?.length || 0, 'posts')
      
      // Log comment counts for debugging
      if (data.posts && data.posts.length > 0) {
        console.log('Post comment counts:', data.posts.map((p: any) => ({
          id: p.id,
          content: p.content?.substring(0, 20),
          childPosts: p._count?.childPosts,
          comments: p._count?.comments,
        })))
      }
      
      // Ensure posts have all required fields
      const validPosts = (data.posts || []).filter((post: any) => {
        if (!post || !post.id) {
          console.warn('Invalid post (missing id):', post)
          return false
        }
        if (!post.content) {
          console.warn('Post missing content:', post.id)
        }
        if (!post.author) {
          console.warn('Post missing author:', post.id)
        }
        // Normalize comment count - use childPosts if available, fallback to comments
        if (post._count) {
          if (post._count.childPosts !== undefined && post._count.comments === undefined) {
            post._count.comments = post._count.childPosts
          } else if (post._count.comments !== undefined && post._count.childPosts === undefined) {
            post._count.childPosts = post._count.comments
          }
        }
        return true
      })
      
      console.log('Valid posts:', validPosts.length)
      setPosts(validPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()

    // Set up Pusher for real-time updates
    if (pusherClient) {
      const channel = pusherClient.subscribe('my-x-channel')

      channel.bind('like-updated', (data: any) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === data.postId) {
              const currentLikes = post._count?.likes || 0
              return {
                ...post,
                liked: data.action === 'liked',
                _count: {
                  ...post._count,
                  likes:
                    data.action === 'liked'
                      ? currentLikes + 1
                      : Math.max(0, currentLikes - 1),
                },
              }
            }
            return post
          })
        )
      })

      channel.bind('new-post', (data: any) => {
        // Only add if viewing 'all' feed
        if (type === 'all' && !userID) {
          setPosts((prevPosts) => [data.post, ...prevPosts])
        }
      })

      channel.bind('new-comment', (data: any) => {
        console.log('Received new-comment event:', data)
        // Update comment count for parent post
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === data.parentPostId) {
              const currentCount = post._count?.childPosts || post._count?.comments || 0
              console.log(`Updating comment count for post ${post.id}: ${currentCount} -> ${currentCount + 1}`)
              return {
                ...post,
                _count: {
                  ...post._count,
                  childPosts: currentCount + 1,
                  comments: currentCount + 1, // Keep both for backward compatibility
                },
              }
            }
            return post
          })
        )
      })

      channel.bind('repost-updated', (data: any) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === data.postId) {
              const currentReposts = post._count?.reposts || 0
              return {
                ...post,
                reposted: data.action === 'reposted',
                _count: {
                  ...post._count,
                  reposts:
                    data.action === 'reposted'
                      ? currentReposts + 1
                      : Math.max(0, currentReposts - 1),
                },
              }
            }
            return post
          })
        )
      })

      return () => {
        if (pusherClient) {
          pusherClient.unsubscribe('my-x-channel')
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, userID, postType])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">No posts yet</div>
      </div>
    )
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
      ))}
    </div>
  )
}

