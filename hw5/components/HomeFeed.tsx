import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import PostList from './PostList'
import PostModal from './PostModal'

export default function HomeFeed() {
  const { data: session } = useSession()
  const [tab, setTab] = useState<'all' | 'following'>('all')
  const [showPostModal, setShowPostModal] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-dark/80 backdrop-blur-md border-b border-dark-border z-10">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTab('all')}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                tab === 'all'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:bg-dark-hover'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTab('following')}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                tab === 'following'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:bg-dark-hover'
              }`}
            >
              Following
            </button>
          </div>
        </div>
      </div>

      {/* Create Post Inline */}
      <div className="border-b border-dark-border p-4">
        <div
          onClick={() => setShowPostModal(true)}
          className="flex items-center space-x-4 cursor-text"
        >
          <img
            src={session?.user?.image || '/default-avatar.png'}
            alt={session?.user?.name || 'User'}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1 text-gray-400">
            What&apos;s happening?
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="flex-1 overflow-y-auto">
        <PostList type={tab} />
      </div>

      {showPostModal && (
        <PostModal onClose={() => setShowPostModal(false)} />
      )}
    </div>
  )
}


