import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { FaTimes, FaImage, FaVideo } from 'react-icons/fa'
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
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

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
          imageUrl: imageUrl || null,
          videoUrl: videoUrl || null,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        
        // If this is a comment, trigger update without full reload
        if (parentPostId) {
          // Close modal first
          onClose()
          
          // Trigger a custom event to update comment count
          window.dispatchEvent(new CustomEvent('comment-added', {
            detail: { parentPostId, comment: data.post }
          }))
          
          // Also try to update via callback if available
          // Small delay to ensure modal is closed
          setTimeout(() => {
            // Try to refresh the post list if we're on a post detail page
            if (window.location.pathname.startsWith('/post/')) {
              window.location.reload()
            } else {
              // On home/feed page, just trigger a refresh
              window.dispatchEvent(new CustomEvent('refresh-posts'))
            }
          }, 100)
        } else {
          // For new posts, reload the page
          onClose()
          window.location.reload()
        }
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

  const handleFileUpload = async (file: File, type: 'image' | 'video') => {
    if (!file) return

    // Validate file type
    if (type === 'image' && !file.type.startsWith('image/')) {
      alert('請選擇圖片檔案')
      return
    }
    if (type === 'video' && !file.type.startsWith('video/')) {
      alert('請選擇影片檔案')
      return
    }

    // Validate file size (10MB for images, 50MB for videos)
    const maxSize = type === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024
    if (file.size > maxSize) {
      alert(type === 'image' ? '圖片大小不能超過 10MB' : '影片大小不能超過 50MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()
        if (type === 'image') {
          setImageUrl(data.url)
          setVideoUrl(null) // Remove video if image is uploaded
        } else {
          setVideoUrl(data.url)
          setImageUrl(null) // Remove image if video is uploaded
        }
      } else {
        const errorData = await res.json()
        alert(errorData.error || '上傳失敗，請重試')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('上傳時發生錯誤，請重試')
    } finally {
      setUploading(false)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleVideoClick = () => {
    videoInputRef.current?.click()
  }

  const removeMedia = () => {
    setImageUrl(null)
    setVideoUrl(null)
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
            <div className="space-y-4">
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
              
              {/* Media Preview */}
              {imageUrl && (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Upload preview"
                    className="w-full max-h-64 object-cover rounded-lg border border-border"
                  />
                  <button
                    onClick={removeMedia}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
              
              {videoUrl && (
                <div className="relative">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full max-h-64 rounded-lg border border-border"
                  />
                  <button
                    onClick={removeMedia}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
              
              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file, 'image')
                }}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file, 'video')
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {!showDrafts && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleImageClick}
                  disabled={uploading || !!videoUrl}
                  className="text-primary hover:text-primary/80 transition p-2 rounded-full hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  title="上傳圖片"
                >
                  <FaImage className="text-xl" />
                </button>
                <button
                  onClick={handleVideoClick}
                  disabled={uploading || !!imageUrl}
                  className="text-primary hover:text-primary/80 transition p-2 rounded-full hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  title="上傳影片"
                >
                  <FaVideo className="text-xl" />
                </button>
                {uploading && (
                  <span className="text-sm text-muted-foreground">上傳中...</span>
                )}
              </div>
              <div className={`text-sm ${length > maxLength ? 'text-destructive' : length > maxLength * 0.9 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                {length}/{maxLength}
              </div>
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


