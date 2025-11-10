import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import PostList from './PostList'
import NewPostNotice from './NewPostNotice'
import { calculatePostLength } from '@/lib/utils'

export default function HomeFeed() {
  const { data: session } = useSession()
  const [tab, setTab] = useState<'all' | 'following'>('all')
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const length = calculatePostLength(content)
  const maxLength = 280
  const canPost = content.trim().length > 0 && length <= maxLength

  const handlePost = async () => {
    if (!canPost || !session?.user?.id) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: content.trim(),
        }),
      })

      if (res.ok) {
        setContent('')
        setIsExpanded(false)
        window.location.reload()
      } else {
        const data = await res.json()
        alert(data.error || '發布失敗，請重試')
      }
    } catch (error) {
      console.error('Error posting:', error)
      alert('發布時發生錯誤，請重試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* New Post Notice */}
      {tab === 'following' && <NewPostNotice />}
      
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTab('all')}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                tab === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTab('following')}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                tab === 'following'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              Following
            </button>
          </div>
        </div>
      </div>

      {/* Create Post Inline */}
      <div className="border-b border-border bg-background">
        {!isExpanded ? (
          <div
            onClick={() => setIsExpanded(true)}
            className="p-4 flex items-center space-x-4 cursor-text hover:bg-secondary/50 transition"
          >
            <img
              src={session?.user?.image || '/default-avatar.png'}
              alt={session?.user?.name || 'User'}
              className="w-12 h-12 rounded-full border border-border"
            />
            <div className="flex-1 text-muted-foreground">
              What&apos;s happening?
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-start space-x-4">
              <img
                src={session?.user?.image || '/default-avatar.png'}
                alt={session?.user?.name || 'User'}
                className="w-12 h-12 rounded-full border border-border"
              />
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's happening?"
                  className="w-full bg-transparent resize-none outline-none text-lg min-h-[120px] text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className={`text-sm ${length > maxLength ? 'text-destructive' : length > maxLength * 0.9 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                    {length}/{maxLength}
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        setContent('')
                        setIsExpanded(false)
                      }}
                      className="px-4 py-2 rounded-full font-semibold text-muted-foreground hover:bg-secondary transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePost}
                      disabled={!canPost || loading}
                      className="px-6 py-2 rounded-full font-semibold bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {loading ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="flex-1 overflow-y-auto">
        <PostList type={tab} />
      </div>
    </div>
  )
}


