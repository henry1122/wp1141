import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { userIDSchema } from '@/lib/userID'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const registerSchema = z.object({
  userID: userIDSchema,
})

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  useEffect(() => {
    // Check if we're coming from an OAuth callback
    const isOAuthCallback = typeof window !== 'undefined' && 
      (window.location.search.includes('code=') || 
       window.location.search.includes('callbackUrl') ||
       window.location.search.includes('error='))
    
    // If coming from OAuth callback and unauthenticated, periodically check session
    if (isOAuthCallback && status === 'unauthenticated') {
      const checkSessionPeriodically = async () => {
        const { getSession } = await import('next-auth/react')
        let attempts = 0
        const maxAttempts = 10 // Check for up to 5 seconds (10 * 500ms)
        
        const interval = setInterval(async () => {
          attempts++
          const currentSession = await getSession()
          if (currentSession) {
            clearInterval(interval)
            // Session is now available, force a re-render by updating state
            window.location.reload()
            return
          }
          if (attempts >= maxAttempts) {
            clearInterval(interval)
            // After max attempts, redirect to signin
            router.push('/auth/signin')
          }
        }, 500)
        
        return () => clearInterval(interval)
      }
      
      checkSessionPeriodically()
      return
    }
    
    // Wait for session to load
    if (status === 'loading') {
      return
    }
    
    if (status === 'authenticated') {
      if (session?.user?.userID) {
        // User already has userID, redirect to home
        router.push('/')
        return
      }
      // User is authenticated but no userID - this is correct, show registration form
      // Don't redirect, just stay on this page
    }
    
    // If unauthenticated, we'll show a message instead of redirecting immediately
    // This allows users to see what they need to do
  }, [session, status, router])

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || 'Registration failed')
        setLoading(false)
        return
      }

      // Wait a bit for database to update
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Force session refresh and redirect
      // Use getSession to refresh the session
      const { getSession } = await import('next-auth/react')
      await getSession()
      
      // Wait a bit more for session to update
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Force full page reload to refresh session
      // The session callback will pick up the new userID from database
      window.location.href = '/'
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  // Show loading while session is being checked
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  // If not authenticated, check if we're coming from OAuth callback
  // If so, show loading message and wait for session
  const isOAuthCallback = typeof window !== 'undefined' && 
    (window.location.search.includes('code=') || 
     window.location.search.includes('callbackUrl') ||
     window.location.search.includes('error='))
  
  if (status === 'unauthenticated') {
    if (isOAuthCallback) {
      // Coming from OAuth callback, wait for session to establish
      return (
        <div className="flex items-center justify-center min-h-screen bg-dark py-8 px-4">
          <div className="w-full max-w-md">
            <div className="bg-dark-hover rounded-2xl p-8 space-y-6 shadow-lg text-center">
              <h1 className="text-3xl font-bold mb-2">Setting up your account...</h1>
              <p className="text-gray-400 mb-6">
                Please wait while we complete your sign-in.
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    
    // Not from OAuth callback, show sign in message
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark py-8 px-4">
        <div className="w-full max-w-md">
          <div className="bg-dark-hover rounded-2xl p-8 space-y-6 shadow-lg text-center">
            <h1 className="text-3xl font-bold mb-2">Please Sign In First</h1>
            <p className="text-gray-400 mb-6">
              You need to sign in with Google or GitHub before you can create your account.
            </p>
            <button
              onClick={() => router.push('/auth/signin')}
              className="w-full bg-primary text-white py-3 px-4 rounded-full font-semibold hover:bg-primary/90 transition"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If user already has userID, show redirecting message
  if (status === 'authenticated' && session?.user?.userID) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Redirecting...</div>
      </div>
    )
  }

  // If authenticated but no userID, show registration form
  // This is the correct state for new users
  if (status === 'authenticated' && session && !session.user?.userID) {
    return (
    <div className="flex items-center justify-center min-h-screen bg-background py-8 px-4">
      <div className="w-full max-w-md">
        <div className="bg-background border border-border rounded-2xl p-8 space-y-6 shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Create your account</h1>
            <p className="text-muted-foreground">Choose your userID</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="userID" className="block text-sm font-medium mb-2 text-foreground">
                UserID
              </label>
              <input
                {...register('userID')}
                type="text"
                id="userID"
                autoFocus
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g. ric2k1"
              />
              {errors.userID && (
                <p className="mt-1 text-sm text-destructive">{errors.userID.message}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                3-20 characters, alphanumeric and underscore only
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive rounded-lg p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? 'Creating account...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
    )
  }

  // Fallback: should not reach here, but just in case
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>
  )
}

