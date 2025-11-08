import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import HomeFeed from '@/components/HomeFeed'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    if (status === 'authenticated' && session) {
      if (!session.user?.userID) {
        router.push('/auth/register')
        return
      }
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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 border-x border-dark-border">
        <HomeFeed />
      </div>
    </div>
  )
}


