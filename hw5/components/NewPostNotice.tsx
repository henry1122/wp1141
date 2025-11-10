import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { pusherClient } from '@/lib/pusher'

interface NewPostNoticeProps {
  onDismiss?: () => void
}

interface NewPostAuthor {
  id: string
  name: string
  userID: string
  image: string | null
}

export default function NewPostNotice({ onDismiss }: NewPostNoticeProps) {
  const { data: session } = useSession()
  const [newPostAuthors, setNewPostAuthors] = useState<NewPostAuthor[]>([])
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set())

  // Fetch following list
  useEffect(() => {
    if (!session?.user?.id || !session?.user?.userID) return

    const fetchFollowing = async () => {
      try {
        const res = await fetch(`/api/users/${session.user.userID}/following`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          const ids = new Set(data.following?.map((u: any) => u.id) || [])
          setFollowingIds(ids)
        }
      } catch (error) {
        console.error('Error fetching following:', error)
      }
    }

    fetchFollowing()
  }, [session?.user?.id, session?.user?.userID])

  // Listen for new posts
  useEffect(() => {
    if (!session?.user?.id || !pusherClient || followingIds.size === 0) return

    const channel = pusherClient.subscribe('my-x-channel')

    const handleNewPost = (data: any) => {
      const post = data.post
      if (!post || !post.author) return

      // Check if the author is in following list
      if (followingIds.has(post.author.id)) {
        // Check if this author is already in the list
        setNewPostAuthors((prev) => {
          const exists = prev.some((a) => a.id === post.author.id)
          if (exists) return prev

          // Add new author (keep only first 3)
          const updated = [
            {
              id: post.author.id,
              name: post.author.name || 'Unknown',
              userID: post.author.userID || 'unknown',
              image: post.author.image || null,
            },
            ...prev,
          ].slice(0, 3)

          return updated
        })
      }
    }

    channel.bind('new-post', handleNewPost)

    return () => {
      if (pusherClient) {
        channel.unbind('new-post', handleNewPost)
      }
    }
  }, [session?.user?.id, followingIds])

  const handleClick = () => {
    // Refresh the page to show new posts
    window.location.reload()
  }

  const handleDismiss = () => {
    setNewPostAuthors([])
    if (onDismiss) {
      onDismiss()
    }
  }

  if (newPostAuthors.length === 0) {
    return null
  }

  return (
    <div className="sticky top-0 z-20 bg-primary/10 border-b border-primary/20 backdrop-blur-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          onClick={handleClick}
          className="flex items-center space-x-3 hover:bg-primary/10 rounded-lg px-3 py-2 transition flex-1 text-left"
        >
          <div className="flex -space-x-2">
            {newPostAuthors.map((author, index) => (
              <img
                key={author.id}
                src={author.image || '/default-avatar.png'}
                alt={author.name}
                className="w-8 h-8 rounded-full border-2 border-background"
                style={{ zIndex: newPostAuthors.length - index }}
              />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {newPostAuthors.length === 1
                ? `${newPostAuthors[0].name} posted`
                : `${newPostAuthors.length} people you follow posted`}
            </p>
            <p className="text-xs text-muted-foreground">Click to view</p>
          </div>
        </button>
        <button
          onClick={handleDismiss}
          className="ml-2 text-muted-foreground hover:text-foreground transition p-2"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  )
}

