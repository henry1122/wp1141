import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import HomeFeed from '@/components/HomeFeed'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Give NextAuth time to load the session
    if (status === 'loading') {
      return // Wait for session to load
    }
    
    // If authenticated and has userID, stay on home page
    if (status === 'authenticated' && session?.user?.userID) {
      // User is logged in with userID, stay on home page
      return
    }
    
    // If authenticated but no userID, redirect to register to input userID
    if (status === 'authenticated' && session && !session.user?.userID) {
      console.log('[Home] User authenticated but no userID, redirecting to register')
      router.push('/auth/register')
      return
    }
    
    // If unauthenticated, redirect to signin
    // But wait a bit to make sure session isn't still loading
    if (status === 'unauthenticated') {
      const timeout = setTimeout(() => {
        router.push('/auth/signin')
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (status === 'unauthenticated' || !session?.user?.userID) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 border-x border-border ml-64">
        <HomeFeed />
      </div>
    </div>
  )
}


