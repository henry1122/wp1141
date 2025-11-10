import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { FaTwitter } from 'react-icons/fa'

export default function SignIn() {
  const router = useRouter()
  const [userID, setUserID] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showUserIDLogin, setShowUserIDLogin] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    let timeoutId: NodeJS.Timeout | null = null
    let intervalId: NodeJS.Timeout | null = null
    let checkCount = 0
    const maxChecks = 20 // Maximum 10 seconds (20 * 500ms)
    
    // Check if we're coming from OAuth callback
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    const callbackUrl = urlParams.get('callbackUrl')
    const code = urlParams.get('code')
    
    // If there's an error, handle it
    if (error) {
      console.error('[SignIn] ❌ OAuth error detected:', error)
      console.error('[SignIn] Full URL:', window.location.href)
      
      // Show user-friendly error message
      if (error === 'Callback') {
        setError('GitHub 登入失敗。請確認：1) GitHub OAuth App 的 Callback URL 設置為 http://localhost:3000/api/auth/callback/github 2) .env.local 中的 GITHUB_ID 和 GITHUB_SECRET 正確 3) NEXTAUTH_URL 和 NEXTAUTH_SECRET 已設置')
      } else {
        setError(`登入錯誤: ${error}`)
      }
      
      // Clear error from URL to prevent loops
      if (window.history.replaceState) {
        window.history.replaceState({}, '', window.location.pathname)
      }
      
      // Don't continue with session check if there's an error
      return
    }
    
    const checkSession = async () => {
      if (!mountedRef.current) return
      checkCount++
      
      // Stop checking after max attempts to prevent infinite loops
      if (checkCount > maxChecks) {
        if (intervalId) clearInterval(intervalId)
        console.log('[SignIn] Max session checks reached, stopping')
        return
      }
      
      try {
        const session = await getSession()
        if (!mountedRef.current) return
        
        if (session?.user?.userID) {
          // User has userID, go to home
          if (intervalId) clearInterval(intervalId)
          console.log('[SignIn] User has userID, redirecting to home')
          router.push('/')
          return
        } else if (session && !session.user?.userID) {
          // User is authenticated but doesn't have userID, redirect to register
          if (intervalId) clearInterval(intervalId)
          console.log('[SignIn] User authenticated but no userID, redirecting to register')
          router.push('/auth/register')
          return
        }
        // If no session and we're coming from OAuth callback, wait a bit more
        if (!session && (code || callbackUrl)) {
          console.log('[SignIn] No session yet, waiting... (attempt', checkCount, ')')
          return
        }
        // If no session and not from OAuth, stop checking
        if (!session && !code && !callbackUrl) {
          if (intervalId) clearInterval(intervalId)
          console.log('[SignIn] No session and not from OAuth, staying on signin page')
          return
        }
      } catch (err) {
        // Ignore errors if component is unmounted
        if (!mountedRef.current) return
        console.error('Error checking session:', err)
      }
    }
    
    // If coming from OAuth callback, start checking session
    if (code || callbackUrl || error) {
      console.log('[SignIn] OAuth callback detected, starting session check')
      // Wait a bit for session to be established
      timeoutId = setTimeout(() => {
        checkSession()
        // Check every 500ms for session updates
        intervalId = setInterval(checkSession, 500)
      }, 1000)
    } else {
      // Not from OAuth, check once
      checkSession()
    }
    
    return () => {
      mountedRef.current = false
      if (timeoutId) clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [router])

  const handleUserIDLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // Check if login was successful (credentials user)
      if (data.success && data.user) {
        // For credentials users, use the credentials-login API to create proper NextAuth session
        if (data.needsManualSession) {
          try {
            const sessionRes = await fetch('/api/auth/credentials-login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userID: data.user.userID }),
              credentials: 'include', // Important: include cookies
            })
            
            if (sessionRes.ok) {
              // Session created successfully
              // Wait a moment for cookie to be set and NextAuth to recognize it
              await new Promise(resolve => setTimeout(resolve, 300))
              
              // Force a full page reload to ensure NextAuth picks up the session
              window.location.href = '/'
              return
            } else {
              const errorData = await sessionRes.json()
              console.error('Session creation failed:', errorData)
              setError('無法創建登入會話，請重試')
              setLoading(false)
              return
            }
          } catch (sessionError) {
            console.error('Session creation error:', sessionError)
            setError('登入失敗，請重試')
            setLoading(false)
            return
          }
        }
        
        // If no manual session needed, try to reload session
        const session = await getSession()
        if (session?.user?.userID || data.user.userID) {
          if (mountedRef.current) {
          router.push('/')
          }
        } else {
          // Wait a bit for session to update, then redirect
          setTimeout(() => {
            if (mountedRef.current) {
            router.push('/')
            }
          }, 500)
        }
        return
      }

      // User found, now sign in with their provider (OAuth users)
      if (data.provider && data.needsOAuthSignIn) {
        // For OAuth users, trigger OAuth signIn with the correct provider
        await signIn(data.provider, { callbackUrl: '/' })
        return
      } else if (data.user?.accounts?.[0]?.provider) {
        const provider = data.user.accounts[0].provider
        if (provider === 'credentials') {
          // Already handled above
          router.push('/')
        } else {
          await signIn(provider, { callbackUrl: '/' })
        }
      } else {
        setError('No OAuth account found for this userID')
        setLoading(false)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-primary-foreground">X</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 text-foreground">My-X</h1>
          <p className="text-muted-foreground">Welcome to My-X</p>
        </div>

        {!showUserIDLogin ? (
          <>
              <div className="space-y-4">
                <button
                  onClick={async () => {
                    // Clear any existing session first (including guest)
                    try {
                      await fetch('/api/auth/signout', { method: 'POST' })
                      // Also clear guest session
                      await fetch('/api/auth/clear-guest-session', { method: 'POST' })
                    } catch (e) {
                      console.error('Error clearing session:', e)
                    }
                    // Then sign in with OAuth - redirect to home, home will check userID
                    await signIn('google', { callbackUrl: '/', redirect: true })
                  }}
                  className="w-full bg-white text-gray-900 py-3 px-4 rounded-full font-semibold hover:bg-gray-100 transition"
                >
                  Continue with Google
                </button>

                <button
                  onClick={async () => {
                    // Clear any existing session first (including guest)
                    try {
                      await fetch('/api/auth/signout', { method: 'POST' })
                      // Also clear guest session
                      await fetch('/api/auth/clear-guest-session', { method: 'POST' })
                    } catch (e) {
                      console.error('Error clearing session:', e)
                    }
                    // Then sign in with OAuth - redirect to home, home will check userID
                    await signIn('github', { callbackUrl: '/', redirect: true })
                  }}
                  className="w-full bg-white text-gray-900 py-3 px-4 rounded-full font-semibold hover:bg-gray-100 transition"
                >
                  Continue with GitHub
                </button>
              </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Or</span>
              </div>
            </div>

            <button
              onClick={() => setShowUserIDLogin(true)}
              className="w-full bg-secondary border border-border text-foreground py-3 px-4 rounded-full font-semibold hover:bg-secondary/80 transition"
            >
              Login with UserID
            </button>
          </>
        ) : (
          <form onSubmit={handleUserIDLogin} className="space-y-4">
            <div>
              <label htmlFor="userID" className="block text-sm font-medium mb-2">
                UserID
              </label>
              <input
                type="text"
                id="userID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your userID"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowUserIDLogin(false)
                  setError('')
                  setUserID('')
                }}
                className="flex-1 bg-secondary border border-border text-foreground py-3 px-4 rounded-full font-semibold hover:bg-secondary/80 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || !userID.trim()}
                className="flex-1 bg-primary text-white py-3 px-4 rounded-full font-semibold hover:bg-primary/90 transition disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}


