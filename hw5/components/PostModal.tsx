import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { FaTimes } from 'react-icons/fa'
import { calculatePostLength } from '@/lib/utils'

interface PostModalProps {
  onClose: () => void
  initialContent?: string
  parentPostId?: string
}

export default function PostModal({ onClose, initialContent = '', parentPostId }: PostModalProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState(initialContent)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDrafts, setShowDrafts] = useState(false)
  const [drafts, setDrafts] = useState<any[]>([])

  const length = calculatePostLength(content)
  const maxLength = 280
  const canPost = content.trim().length > 0 && length <= maxLength

  const handlePost = async () => {
    if (!canPost || !session?.user?.id) {
      if (!session?.user?.id) {
        alert('請先登入')
      }
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: include cookies
        body: JSON.stringify({
          content: content.trim(),
          parentPostId: parentPostId || null,
        }),
      })

      if (res.ok) {
        onClose()
        // Reload to show the new post/comment
        window.location.reload()
      } else {
        const data = await res.json()
        alert(data.error || '發布失敗，請重試')
        console.error('Post error:', data)
      }
    } catch (error) {
      console.error('Error posting:', error)
      alert('發布時發生錯誤，請重試')
    } finally {
      setLoading(false)
    }
  }

  const handleDiscard = () => {
    if (content.trim().length > 0) {
      setShowDiscardConfirm(true)
    } else {
      onClose()
    }
  }

  const handleSaveDraft = async () => {
    try {
      await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      onClose()
    } catch (error) {
      console.error('Error saving draft:', error)
    }
  }

  const handleLoadDrafts = async () => {
    try {
      const res = await fetch('/api/drafts')
      const data = await res.json()
      setDrafts(data.drafts || [])
      setShowDrafts(true)
    } catch (error) {
      console.error('Error loading drafts:', error)
    }
  }

  const handleDeleteDraft = async (id: string) => {
    try {
      await fetch(`/api/drafts?id=${id}`, { method: 'DELETE' })
      setDrafts(drafts.filter((d) => d.id !== id))
    } catch (error) {
      console.error('Error deleting draft:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button
            onClick={handleDiscard}
            className="text-muted-foreground hover:text-foreground transition rounded-full p-2 hover:bg-secondary"
          >
            <FaTimes className="text-xl" />
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLoadDrafts}
              className="text-primary hover:text-primary/80 transition px-3 py-2 rounded-full hover:bg-secondary"
            >
              Drafts
            </button>
            <button
              onClick={handlePost}
              disabled={!canPost || loading}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {showDrafts ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4 text-foreground">Drafts</h2>
              {drafts.length === 0 ? (
                <p className="text-muted-foreground">No drafts</p>
              ) : (
                drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="bg-secondary p-4 rounded-lg flex items-center justify-between border border-border"
                  >
                    <p className="flex-1 text-foreground">{draft.content.substring(0, 100)}...</p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setContent(draft.content)
                          setShowDrafts(false)
                        }}
                        className="text-primary hover:text-primary/80 px-3 py-1 rounded hover:bg-secondary"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="text-destructive hover:text-destructive/80 px-3 py-1 rounded hover:bg-secondary"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => {
                const newContent = e.target.value
                // Check length and prevent typing if over limit (except for hashtags/mentions)
                const testLength = calculatePostLength(newContent)
                if (testLength <= maxLength || newContent.length <= content.length) {
                  setContent(newContent)
                }
              }}
              placeholder="What's happening?"
              className="w-full bg-transparent resize-none outline-none text-lg min-h-[200px] text-foreground placeholder:text-muted-foreground"
            />
          )}
        </div>

        {/* Footer */}
        {!showDrafts && (
          <div className="p-4 border-t border-border flex items-center justify-between">
            <div className={`text-sm ${length > maxLength ? 'text-destructive' : length > maxLength * 0.9 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
              {length}/{maxLength}
            </div>
          </div>
        )}

        {/* Discard Confirmation */}
        {showDiscardConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-60">
            <div className="bg-background rounded-2xl p-6 max-w-md w-full mx-4 border border-border shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-foreground">Discard post?</h3>
              <p className="text-muted-foreground mb-6">
                This can&apos;t be undone and you&apos;ll lose your draft.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleSaveDraft}
                  className="flex-1 bg-secondary border border-border py-3 rounded-full font-semibold hover:bg-secondary/80 transition text-foreground"
                >
                  Save draft
                </button>
                <button
                  onClick={() => {
                    setShowDiscardConfirm(false)
                    onClose()
                  }}
                  className="flex-1 bg-destructive text-destructive-foreground py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


