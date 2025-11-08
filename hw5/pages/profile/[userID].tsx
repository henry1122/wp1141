import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Sidebar from '@/components/Sidebar'
import PostList from '@/components/PostList'
import { FaArrowLeft, FaEdit, FaUserPlus, FaUserCheck } from 'react-icons/fa'

export default function Profile() {
  const router = useRouter()
  const { userID } = router.query
  const { data: session } = useSession()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts')
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    if (userID) {
      fetchUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID])

  const fetchUser = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${userID}`)
      const data = await res.json()
      setUser(data.user)
      setIsFollowing(data.user.isFollowing)
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    if (!session?.user?.id) return

    try {
      const res = await fetch(`/api/users/${userID}/follow`, {
        method: 'POST',
      })

      if (res.ok) {
        const data = await res.json()
        setIsFollowing(data.isFollowing)
        fetchUser() // Refresh user stats
      }
    } catch (error) {
      console.error('Error following user:', error)
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

  if (!user) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">User not found</div>
        </div>
      </div>
    )
  }

  const isOwnProfile = user.isOwnProfile

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 border-x border-dark-border">
        {/* Header */}
        <div className="sticky top-0 bg-dark/80 backdrop-blur-md border-b border-dark-border z-10">
          <div className="flex items-center space-x-4 p-4">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white transition"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm text-gray-400">{user._count?.posts || 0} Posts</p>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-64 bg-gray-700 relative">
            {user.coverImage && (
              <img
                src={user.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            {isOwnProfile && (
              <button
                onClick={() => setShowEditModal(true)}
                className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full font-semibold hover:bg-black/70 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-16 left-4">
            <img
              src={user.image || '/default-avatar.png'}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-dark"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end p-4">
            {!isOwnProfile && (
              <button
                onClick={handleFollow}
                className={`flex items-center space-x-2 px-6 py-2 rounded-full font-semibold transition ${
                  isFollowing
                    ? 'bg-dark-hover border border-dark-border hover:border-red-500 hover:text-red-500'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {isFollowing ? (
                  <>
                    <FaUserCheck />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="px-4 pt-20 pb-4">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-400">@{user.userID}</p>
            {user.bio && <p className="mt-4">{user.bio}</p>}

            {/* Stats */}
            <div className="flex items-center space-x-4 mt-4 text-sm">
              <span>
                <span className="font-semibold">{user._count?.following || 0}</span>{' '}
                <span className="text-gray-400">Following</span>
              </span>
              <span>
                <span className="font-semibold">{user._count?.followers || 0}</span>{' '}
                <span className="text-gray-400">Followers</span>
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-dark-border">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-4 text-center font-semibold transition ${
                activeTab === 'posts'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Posts
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab('likes')}
                className={`flex-1 py-4 text-center font-semibold transition ${
                  activeTab === 'likes'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Likes
              </button>
            )}
          </div>
        </div>

        {/* Posts */}
        <div className="min-h-screen">
          <PostList
            userID={userID as string}
            postType={activeTab}
          />
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => {
            setShowEditModal(false)
            fetchUser()
          }}
        />
      )}
    </div>
  )
}

function EditProfileModal({ user, onClose }: { user: any; onClose: () => void }) {
  const [bio, setBio] = useState(user.bio || '')
  const [coverImage, setCoverImage] = useState(user.coverImage || '')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.url) {
        setCoverImage(data.url)
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${user.userID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, coverImage }),
      })

      if (res.ok) {
        onClose()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-dark-border">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
              placeholder="Tell us about yourself"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={uploading}
            />
            {uploading && <p className="mt-2 text-sm text-gray-400">Uploading...</p>}
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover preview"
                className="mt-4 rounded-lg max-w-full max-h-64 object-cover"
              />
            )}
          </div>
        </div>

        <div className="p-4 border-t border-dark-border flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

