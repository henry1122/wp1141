import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Sidebar from '@/components/Sidebar'
import PostCard from '@/components/PostCard'
import PostModal from '@/components/PostModal'
import { FaArrowLeft } from 'react-icons/fa'

export default function PostDetail() {
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCommentModal, setShowCommentModal] = useState(false)

  useEffect(() => {
    if (id) {
      fetchPost()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchPost = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/posts/${id}`)
      const data = await res.json()
      setPost(data.post)
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (post?.parentPostId) {
      router.push(`/post/${post.parentPostId}`)
    } else {
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Post not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 border-x border-dark-border">
        {/* Header */}
        <div className="sticky top-0 bg-dark/80 backdrop-blur-md border-b border-dark-border z-10">
          <div className="flex items-center space-x-4 p-4">
            <button
              onClick={handleBack}
              className="text-gray-400 hover:text-white transition"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <span className="text-xl font-bold">Post</span>
          </div>
        </div>

        {/* Main Post */}
        <PostCard post={post} onUpdate={fetchPost} />

        {/* Inline Comment Input */}
        {session?.user?.id && (
          <div className="border-b border-dark-border p-4">
            <div
              onClick={() => setShowCommentModal(true)}
              className="flex items-center space-x-4 cursor-text"
            >
              <img
                src={session?.user?.image || '/default-avatar.png'}
                alt={session?.user?.name || 'User'}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 text-gray-400">
                Post your reply
              </div>
            </div>
          </div>
        )}

        {/* Comments */}
        {post.childPosts && post.childPosts.length > 0 && (
          <div>
            {post.childPosts.map((comment: any) => (
              <PostCard key={comment.id} post={comment} onUpdate={fetchPost} />
            ))}
          </div>
        )}

        {/* Load more comments would go here */}
      </div>

      {showCommentModal && (
        <PostModal
          onClose={() => setShowCommentModal(false)}
          parentPostId={id as string}
        />
      )}
    </div>
  )
}


