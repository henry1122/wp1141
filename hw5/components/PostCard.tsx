import { useState } from 'react'
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

  const isOwnPost = session?.user?.id === post.author.id

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
      <div className="border-b border-dark-border p-4 hover:bg-dark-hover/50 transition">
        <div className="flex space-x-3">
          {/* Avatar */}
          <img
            src={post.author.image || '/default-avatar.png'}
            alt={post.author.name}
            className="w-12 h-12 rounded-full cursor-pointer"
            onClick={handleAuthorClick}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span
                  className="font-semibold cursor-pointer hover:underline"
                  onClick={handleAuthorClick}
                >
                  {post.author.name}
                </span>
                <span
                  className="text-gray-400 cursor-pointer hover:underline"
                  onClick={handleAuthorClick}
                >
                  @{post.author.userID}
                </span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-400">{formatTimeAgo(post.createdAt)}</span>
              </div>

              {isOwnPost && !post.isRepost && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <FaEllipsisH />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-8 bg-dark-hover border border-dark-border rounded-lg shadow-lg overflow-hidden z-10">
                      <button
                        onClick={() => {
                          handleDelete()
                          setShowMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-dark transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Post Content */}
            <div
              className="mb-3 whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
              onClick={handleContentClick}
            />

            {/* Image */}
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="rounded-2xl mb-3 max-w-full"
              />
            )}

            {/* Interactions */}
            <div className="flex items-center space-x-6 text-gray-400">
              <button
                onClick={() => setShowCommentModal(true)}
                className="flex items-center space-x-2 hover:text-primary transition"
              >
                <FaComment />
                <span>{post._count.comments}</span>
              </button>

              <button
                onClick={handleRepost}
                className={`flex items-center space-x-2 transition ${
                  post.reposted ? 'text-green-500' : 'hover:text-green-500'
                }`}
              >
                <FaRetweet />
                <span>{post._count.reposts}</span>
              </button>

              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition ${
                  post.liked ? 'text-red-500' : 'hover:text-red-500'
                }`}
              >
                <FaHeart className={post.liked ? 'fill-current' : ''} />
                <span>{post._count.likes}</span>
              </button>
            </div>

            {/* Comments Preview */}
            {post.childPosts && post.childPosts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-dark-border">
                {post.childPosts.slice(0, 2).map((comment: any) => (
                  <div
                    key={comment.id}
                    className="mb-2 text-sm text-gray-400 cursor-pointer hover:text-white transition"
                    onClick={() => router.push(`/post/${comment.id}`)}
                  >
                    <span className="font-semibold text-white">
                      {comment.author.userID}
                    </span>
                    {' '}
                    {comment.content.substring(0, 100)}
                    {comment.content.length > 100 && '...'}
                  </div>
                ))}
                {post.childPosts.length > 2 && (
                  <button
                    onClick={() => router.push(`/post/${post.id}`)}
                    className="text-sm text-primary hover:underline"
                  >
                    View more comments
                  </button>
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

