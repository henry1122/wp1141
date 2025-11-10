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
      <div className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-background p-4 flex flex-col z-10">
        {/* Logo */}
        <div className="mb-8 pl-2">
          <div 
            className="flex items-center justify-center h-12 w-12 rounded-full hover:bg-secondary transition-colors cursor-pointer"
            onClick={() => navigateTo('/')}
          >
            <span className="text-3xl font-bold text-primary">X</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <button
            onClick={() => navigateTo('/')}
            className={`w-full flex items-center space-x-4 px-4 py-3 rounded-full transition ${
              router.pathname === '/' 
                ? 'bg-primary text-primary-foreground font-semibold' 
                : 'hover:bg-secondary text-foreground'
            }`}
          >
            <FaHome className="text-xl" />
            <span className="text-lg">Home</span>
          </button>

          <button
            onClick={() => navigateTo(`/profile/${session?.user?.userID}`)}
            className={`w-full flex items-center space-x-4 px-4 py-3 rounded-full transition hover:bg-secondary text-foreground`}
          >
            <FaUser className="text-xl" />
            <span className="text-lg">Profile</span>
          </button>

          <button
            onClick={() => setShowPostModal(true)}
            className="w-full bg-primary text-primary-foreground flex items-center justify-center space-x-2 px-4 py-3 rounded-full font-semibold hover:opacity-90 transition shadow-sm"
          >
            <FaFeather />
            <span>Post</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="relative mt-auto" ref={menuRef}>
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="w-full flex items-center space-x-3 p-3 rounded-full hover:bg-secondary transition"
          >
            <img
              src={session?.user?.image || '/default-avatar.png'}
              alt={session?.user?.name || 'User'}
              className="w-10 h-10 rounded-full border border-border"
            />
            <div className="flex-1 text-left min-w-0">
              <div className="font-semibold text-sm truncate">{session?.user?.name}</div>
              <div className="text-xs text-muted-foreground truncate">@{session?.user?.userID}</div>
            </div>
          </button>

          {showLogout && (
            <div className="absolute bottom-full mb-2 w-full bg-background border border-border rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-secondary transition text-destructive"
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


