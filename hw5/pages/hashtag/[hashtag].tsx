import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import PostList from '@/components/PostList'

export default function HashtagPage() {
  const router = useRouter()
  const { hashtag } = router.query
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated' || !session?.user?.userID) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 border-x border-border ml-64">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold">#{hashtag}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Posts tagged with #{hashtag}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <PostList type="all" hashtag={hashtag as string} />
        </div>
      </div>
    </div>
  )
}

