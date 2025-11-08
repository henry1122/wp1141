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

      const res = await fetch(url)
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
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
        // Update comment count for parent post
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === data.parentPostId) {
              return {
                ...post,
                _count: {
                  ...post._count,
                  comments: (post._count?.comments || 0) + 1,
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

