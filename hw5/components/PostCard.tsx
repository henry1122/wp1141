import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { FaHeart, FaComment, FaRetweet, FaTrash, FaEllipsisH } from 'react-icons/fa'
import { formatTimeAgo, extractUrls, extractMentions } from '@/lib/utils'
import PostModal from './PostModal'

interface PostCardProps {
  post: any
  onUpdate?: () => void
}

export default function PostCard({ post, onUpdate }: PostCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  // Comments are stored as childPosts in Prisma
  const [commentCount, setCommentCount] = useState(post._count?.childPosts || post._count?.comments || 0)

  // Update comment count when post prop changes
  useEffect(() => {
    setCommentCount(post._count?.childPosts || post._count?.comments || 0)
  }, [post._count?.childPosts, post._count?.comments])

  // Convert both to strings for comparison (MongoDB ObjectId)
  const isOwnPost = session?.user?.id && post.author?.id && 
    session.user.id.toString() === post.author.id.toString()

  // Fetch comments when showing comments
  const fetchComments = async () => {
    if (loadingComments) return
    setLoadingComments(true)
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  // Toggle comments visibility
  const handleToggleComments = () => {
    if (!showComments) {
      setShowComments(true)
      fetchComments()
    } else {
      setShowComments(false)
    }
  }

  // Listen for comment added events
  useEffect(() => {
    const handleCommentAdded = (event: CustomEvent) => {
      if (event.detail?.parentPostId === post.id) {
        setCommentCount((prev: number) => prev + 1)
        // Add new comment to list if comments are shown
        if (showComments && event.detail?.comment) {
          setComments((prev: any[]) => [event.detail.comment, ...prev])
        } else if (showComments) {
          // Refresh comments if they're currently shown
          fetchComments()
        }
        if (onUpdate) {
          onUpdate()
        }
      }
    }

    const handleRefresh = () => {
      if (showComments) {
        fetchComments()
      }
      if (onUpdate) {
        onUpdate()
      }
    }

    window.addEventListener('comment-added', handleCommentAdded as EventListener)
    window.addEventListener('refresh-posts', handleRefresh)

    return () => {
      window.removeEventListener('comment-added', handleCommentAdded as EventListener)
      window.removeEventListener('refresh-posts', handleRefresh)
    }
  }, [post.id, onUpdate, showComments])

  const handleLike = async () => {
    if (!session?.user?.id) return

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
      })

      if (res.ok && onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleRepost = async () => {
    if (!session?.user?.id) return

    try {
      const res = await fetch(`/api/posts/${post.id}/repost`, {
        method: 'POST',
      })

      if (res.ok) {
        const data = await res.json()
        // Update local state immediately for better UX
        if (onUpdate) {
          onUpdate()
        }
      }
    } catch (error) {
      console.error('Error reposting:', error)
    }
  }

  const handleDelete = async () => {
    if (!session?.user?.id) {
      alert('請先登入')
      return
    }

    if (!confirm('確定要刪除這篇貼文嗎？')) return

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
        credentials: 'include', // Important: include cookies
      })

      if (res.ok) {
        if (onUpdate) {
          onUpdate()
        } else {
          // If no onUpdate callback, reload the page
          window.location.reload()
        }
      } else {
        const data = await res.json()
        alert(data.error || '刪除失敗')
        console.error('Delete error:', data)
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('刪除時發生錯誤，請重試')
    }
  }

  const handleMentionClick = (mention: string) => {
    const userID = mention.replace('@', '')
    router.push(`/profile/${userID}`)
  }

  const handleAuthorClick = () => {
    router.push(`/profile/${post.author.userID}`)
  }

  const formatContent = (content: string) => {
    let formatted = content

    // Replace URLs first (before hashtags and mentions to avoid conflicts)
    const urls = extractUrls(content)
    // Sort by length (longest first) to avoid partial replacements
    const sortedUrls = urls.sort((a, b) => b.length - a.length)
    sortedUrls.forEach((url) => {
      const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      formatted = formatted.replace(
        new RegExp(escapedUrl, 'g'),
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${url}</a>`
      )
    })

    // Replace mentions (before hashtags to avoid conflicts with #)
    const mentions = extractMentions(content)
    // Sort by length (longest first) to avoid partial replacements
    const sortedMentions = mentions.sort((a, b) => b.length - a.length)
    sortedMentions.forEach((mention) => {
      const userID = mention.replace('@', '')
      const escapedMention = mention.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      formatted = formatted.replace(
        new RegExp(escapedMention, 'g'),
        `<span class="text-primary cursor-pointer hover:underline" data-userid="${userID}">${mention}</span>`
      )
    })

    // Replace hashtags last
    const hashtagRegex = /#\w+/g
    formatted = formatted.replace(
      hashtagRegex,
      (match) => {
        // Don't replace if it's part of a URL or mention
        if (formatted.indexOf(`<a href`, formatted.indexOf(match)) !== -1) {
          return match
        }
        return `<span class="text-primary">${match}</span>`
      }
    )

    return formatted
  }

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.hasAttribute('data-userid')) {
      const userID = target.getAttribute('data-userid')
      if (userID) {
        router.push(`/profile/${userID}`)
      }
    }
  }

  return (
    <>
      <div className="border-b border-border p-4 hover:bg-secondary/30 transition bg-background">
        <div className="flex space-x-3">
          {/* Avatar */}
          <img
            src={post.author.image || '/default-avatar.png'}
            alt={post.author.name}
            className="w-12 h-12 rounded-full cursor-pointer border border-border"
            onClick={handleAuthorClick}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span
                  className="font-semibold cursor-pointer hover:underline text-foreground"
                  onClick={handleAuthorClick}
                >
                  {post.author.name}
                </span>
                <span
                  className="text-muted-foreground cursor-pointer hover:underline"
                  onClick={handleAuthorClick}
                >
                  @{post.author.userID}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{formatTimeAgo(post.createdAt)}</span>
              </div>

              {isOwnPost && !post.isRepost && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-muted-foreground hover:text-foreground transition rounded-full p-2 hover:bg-secondary"
                  >
                    <FaEllipsisH />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-8 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-10">
                      <button
                        onClick={() => {
                          handleDelete()
                          setShowMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-destructive hover:bg-secondary transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Post Content */}
            {post.content && (
              <div
                className="mb-3 whitespace-pre-wrap break-words text-foreground"
                dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                onClick={handleContentClick}
              />
            )}

            {/* Image */}
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="rounded-xl mb-3 max-w-full border border-border"
              />
            )}

            {/* Interactions */}
            <div className="flex items-center space-x-6 text-muted-foreground">
              <button
                onClick={handleToggleComments}
                className={`flex items-center space-x-2 transition rounded-full p-2 hover:bg-secondary/50 ${
                  showComments ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                <FaComment />
                <span>{commentCount}</span>
              </button>

              <button
                onClick={handleRepost}
                className={`flex items-center space-x-2 transition rounded-full p-2 hover:bg-secondary/50 ${
                  post.reposted ? 'text-green-600' : 'hover:text-green-600'
                }`}
              >
                <FaRetweet />
                <span>{post._count.reposts}</span>
              </button>

              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition rounded-full p-2 hover:bg-secondary/50 ${
                  post.liked ? 'text-red-600' : 'hover:text-red-600'
                }`}
              >
                <FaHeart className={post.liked ? 'fill-current' : ''} />
                <span>{post._count.likes}</span>
              </button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-4 pt-4 border-t border-border">
                {loadingComments ? (
                  <div className="text-center py-4 text-muted-foreground">載入留言中...</div>
                ) : comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment: any) => (
                      <div
                        key={comment.id}
                        className="flex space-x-3 pb-4 border-b border-border last:border-0"
                      >
                        <img
                          src={comment.author?.image || '/default-avatar.png'}
                          alt={comment.author?.name || 'User'}
                          className="w-10 h-10 rounded-full cursor-pointer"
                          onClick={() => router.push(`/profile/${comment.author?.userID}`)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span
                              className="font-semibold text-foreground cursor-pointer hover:underline"
                              onClick={() => router.push(`/profile/${comment.author?.userID}`)}
                            >
                              {comment.author?.name || 'Unknown'}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              @{comment.author?.userID || 'unknown'}
                            </span>
                            <span className="text-muted-foreground text-sm">·</span>
                            <span className="text-muted-foreground text-sm">
                              {formatTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          <div className="text-foreground whitespace-pre-wrap break-words">
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">尚無留言</div>
                )}
                
                {/* Add Comment Button */}
                {session?.user?.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <button
                      onClick={() => setShowCommentModal(true)}
                      className="w-full text-left px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-lg transition text-foreground"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={session.user.image || '/default-avatar.png'}
                          alt={session.user.name || 'User'}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-muted-foreground">寫下你的留言...</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCommentModal && (
        <PostModal
          onClose={() => setShowCommentModal(false)}
          parentPostId={post.id}
        />
      )}
    </>
  )
}

