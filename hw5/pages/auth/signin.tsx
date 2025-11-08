import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FaTwitter } from 'react-icons/fa'

export default function SignIn() {
  const router = useRouter()
  const [userID, setUserID] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showUserIDLogin, setShowUserIDLogin] = useState(false)

  useEffect(() => {
    // Check if there's an error in the URL (e.g., error=Callback)
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    const callbackUrl = urlParams.get('callbackUrl')
    
    // If there's an error but we have a callbackUrl, try to redirect anyway
    if (error && callbackUrl) {
      // Decode the callbackUrl
      const decodedUrl = decodeURIComponent(callbackUrl)
      if (decodedUrl.includes('/auth/register')) {
        // Wait a bit for session to be established, then redirect
        setTimeout(() => {
          router.push('/auth/register')
        }, 1000)
        return
      }
    }
    
    const checkSession = async () => {
      const session = await getSession()
      if (session?.user?.userID) {
        // User has userID, go to home
        router.push('/')
        return
      } else if (session && !session.user?.userID) {
        // User is authenticated but doesn't have userID, redirect to register
        router.push('/auth/register')
        return
      }
      // If no session, stay on signin page
    }
    
    // Check immediately
    checkSession()
    
    // Also listen for session changes (e.g., after OAuth callback)
    // Check every 500ms for session updates
    const interval = setInterval(checkSession, 500)
    return () => clearInterval(interval)
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
          router.push('/')
        } else {
          // Wait a bit for session to update, then redirect
          setTimeout(() => {
            router.push('/')
          }, 500)
        }
        return
      }

      // User found, now sign in with their provider (OAuth users)
      if (data.user?.accounts?.[0]?.provider) {
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
    <div className="flex items-center justify-center min-h-screen bg-dark">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <FaTwitter className="mx-auto text-6xl text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-2">My-X</h1>
          <p className="text-gray-400">Welcome to My-X</p>
        </div>

        {!showUserIDLogin ? (
          <>
        <div className="space-y-4">
          <button
                onClick={() => signIn('google', { callbackUrl: '/auth/register' })}
            className="w-full bg-white text-gray-900 py-3 px-4 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Continue with Google
          </button>

          <button
                onClick={() => signIn('github', { callbackUrl: '/auth/register' })}
            className="w-full bg-white text-gray-900 py-3 px-4 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Continue with GitHub
          </button>

          <button
                onClick={() => signIn('facebook', { callbackUrl: '/auth/register' })}
            className="w-full bg-white text-gray-900 py-3 px-4 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Continue with Facebook
          </button>
        </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark text-gray-400">Or</span>
              </div>
            </div>

            <button
              onClick={() => setShowUserIDLogin(true)}
              className="w-full bg-dark-hover border border-dark-border text-white py-3 px-4 rounded-full font-semibold hover:bg-dark-border transition"
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
                className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
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
                className="flex-1 bg-dark-hover border border-dark-border text-white py-3 px-4 rounded-full font-semibold hover:bg-dark-border transition"
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


