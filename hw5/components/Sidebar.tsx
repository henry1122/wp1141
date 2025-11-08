import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { FaHome, FaUser, FaFeather, FaSignOutAlt } from 'react-icons/fa'
import PostModal from './PostModal'

export default function Sidebar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [showLogout, setShowLogout] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLogout(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/signin' })
  }

  const navigateTo = (path: string) => {
    router.push(path)
  }

  return (
    <>
      <div className="w-64 min-h-screen border-r border-dark-border p-4 flex flex-col">
        {/* Logo */}
        <div className="mb-8">
          <div className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigateTo('/')}>
            My-X
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <button
            onClick={() => navigateTo('/')}
            className={`w-full flex items-center space-x-4 px-4 py-3 rounded-full transition ${
              router.pathname === '/' ? 'bg-primary text-white' : 'hover:bg-dark-hover'
            }`}
          >
            <FaHome className="text-xl" />
            <span className="text-lg font-medium">Home</span>
          </button>

          <button
            onClick={() => navigateTo(`/profile/${session?.user?.userID}`)}
            className={`w-full flex items-center space-x-4 px-4 py-3 rounded-full transition hover:bg-dark-hover`}
          >
            <FaUser className="text-xl" />
            <span className="text-lg font-medium">Profile</span>
          </button>

          <button
            onClick={() => setShowPostModal(true)}
            className="w-full bg-primary text-white flex items-center justify-center space-x-2 px-4 py-3 rounded-full font-semibold hover:bg-primary/90 transition"
          >
            <FaFeather />
            <span>Post</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="w-full flex items-center space-x-3 p-3 rounded-full hover:bg-dark-hover transition"
          >
            <img
              src={session?.user?.image || '/default-avatar.png'}
              alt={session?.user?.name || 'User'}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 text-left">
              <div className="font-semibold">{session?.user?.name}</div>
              <div className="text-sm text-gray-400">@{session?.user?.userID}</div>
            </div>
          </button>

          {showLogout && (
            <div className="absolute bottom-full mb-2 w-full bg-dark-hover border border-dark-border rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark transition text-red-500"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showPostModal && (
        <PostModal onClose={() => setShowPostModal(false)} />
      )}
    </>
  )
}


