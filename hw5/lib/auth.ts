import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import { userIDSchema } from './userID'

// Wrap adapter initialization in try-catch to catch any errors
let adapter: any
try {
  // Test database connection before initializing adapter
  if (typeof window === 'undefined') {
    prisma.$connect().then(() => {
      console.log('✅ Database connection successful')
    }).catch((err) => {
      console.error('❌ Database connection failed:', err)
    })
  }
  
  adapter = PrismaAdapter(prisma) as any
  console.log('✅ PrismaAdapter initialized successfully')
} catch (error) {
  console.error('❌ Error initializing PrismaAdapter:', error)
  if (error instanceof Error) {
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
  }
  throw error
}

export const authOptions: NextAuthOptions = {
  adapter: adapter,
  debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
  secret: process.env.NEXTAUTH_SECRET, // Explicitly set secret
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "online",
          response_type: "code",
          // Allow all users, not just test users
          hd: undefined, // Remove domain restriction if any
        }
      },
      // Allow all users to sign in
      allowDangerousEmailAccountLinking: false,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Even with database session strategy, NextAuth may call this callback
      // We need to handle it to prevent callback loops
      if (user) {
        token.id = (user as any).id
        token.userID = (user as any).userID
      }
      return token
    },
    async signIn({ user, account, profile }) {
      try {
        // Always allow sign in - PrismaAdapter will handle user creation
        // We'll check for userID in the redirect callback or session callback
        console.log('[NextAuth SignIn] ===== Sign In Callback =====')
        console.log('[NextAuth SignIn] User email:', user.email)
        console.log('[NextAuth SignIn] User name:', user.name)
        console.log('[NextAuth SignIn] Provider:', account?.provider)
        console.log('[NextAuth SignIn] Account ID:', account?.providerAccountId)
        
        if (!account || !user.email) {
          console.log('[NextAuth SignIn] ❌ Missing account or email, returning false')
          return false
        }
        
        // Test database connection
        try {
          await prisma.$connect()
          console.log('[NextAuth SignIn] ✅ Database connection OK')
        } catch (dbError) {
          console.error('[NextAuth SignIn] ❌ Database connection error:', dbError)
          if (dbError instanceof Error) {
            console.error('[NextAuth SignIn] Database error message:', dbError.message)
          }
          // Don't return false here - let PrismaAdapter handle it
        }
        
        console.log('[NextAuth SignIn] ✅ Allowing sign in')
        return true
      } catch (error) {
        console.error('[NextAuth SignIn] ❌ Error in signIn callback:', error)
        // Log full error details
        if (error instanceof Error) {
          console.error('[NextAuth SignIn] Error message:', error.message)
          console.error('[NextAuth SignIn] Error stack:', error.stack)
        }
        // Return false to prevent sign in on error
        return false
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        // Log for debugging
        console.log('[NextAuth Redirect] ===== Redirect Callback =====')
        console.log('[NextAuth Redirect] url:', url, 'baseUrl:', baseUrl)
        
        // Prevent infinite loops - if url is already a callback URL, redirect to home
        if (url && (url.includes('/api/auth/callback') || url.includes('/api/auth/signin'))) {
          console.log('[NextAuth Redirect] ⚠️ Detected callback URL, redirecting to home to prevent loop')
          return `${baseUrl}/`
        }
        
        // The url parameter from NextAuth is the callbackUrl we set in signIn()
        // It can be a relative path like '/' or '/auth/register' or an absolute URL
        
        // Normalize the URL
        let targetUrl = url || baseUrl
        
        // If callbackUrl is explicitly set to home, use it
        if (targetUrl === '/' || targetUrl === baseUrl || targetUrl === `${baseUrl}/`) {
          console.log('[NextAuth Redirect] ✅ Redirecting to home (/)')
          return `${baseUrl}/`
        }
        
        // Check if url is explicitly '/auth/register' or contains it
        if (targetUrl === '/auth/register' || targetUrl === `${baseUrl}/auth/register` || 
            (targetUrl && targetUrl.includes('/auth/register'))) {
          console.log('[NextAuth Redirect] ✅ Redirecting to /auth/register')
          return `${baseUrl}/auth/register`
        }
        
        // Parse URL to check for callbackUrl in query params
        try {
          const urlObj = new URL(targetUrl, baseUrl)
          const callbackUrl = urlObj.searchParams.get('callbackUrl')
          if (callbackUrl) {
            const decoded = decodeURIComponent(callbackUrl)
            console.log('[NextAuth Redirect] Found callbackUrl in query:', decoded)
            
            // Prevent loops - don't redirect back to callback URLs
            if (decoded.includes('/api/auth/callback') || decoded.includes('/api/auth/signin')) {
              console.log('[NextAuth Redirect] ⚠️ Callback URL detected in query, redirecting to home')
              return `${baseUrl}/`
            }
            
            if (decoded === '/' || decoded === baseUrl || decoded === `${baseUrl}/`) {
              console.log('[NextAuth Redirect] ✅ Redirecting to home from callbackUrl')
              return `${baseUrl}/`
            }
            if (decoded.includes('/auth/register')) {
              console.log('[NextAuth Redirect] ✅ Redirecting to /auth/register from callbackUrl')
              return `${baseUrl}/auth/register`
            }
            // Use the decoded callbackUrl if it's a valid path
            if (decoded.startsWith('/') && !decoded.includes('/api/auth/')) {
              return `${baseUrl}${decoded}`
            }
            if (decoded.startsWith('http') && decoded.includes(baseUrl) && !decoded.includes('/api/auth/callback')) {
              return decoded
            }
          }
        } catch (e) {
          // Not a valid URL, continue
          console.log('[NextAuth Redirect] URL parsing error (expected):', e)
        }
        
        // Default: redirect to home page
        // The home page will check if user has userID and redirect to register if needed
        console.log('[NextAuth Redirect] ✅ Default: Redirecting to home (/)')
        return `${baseUrl}/`
      } catch (error) {
        console.error('[NextAuth Redirect] ❌ Error in redirect callback:', error)
        // Fallback to home page
        return `${baseUrl}/`
      }
    },
    async session({ session, user }) {
      try {
        console.log('[NextAuth Session] ===== Session Callback =====')
        console.log('[NextAuth Session] User ID from adapter:', (user as any)?.id)
        console.log('[NextAuth Session] Session user email:', session?.user?.email)
        
        if (!session || !session.user) {
          console.error('[NextAuth Session] ❌ Missing session or session.user')
          return session
        }
        
        if (!user || !(user as any)?.id) {
          console.error('[NextAuth Session] ❌ Missing user or user.id')
          return session
        }
        
        if (session.user && user) {
          try {
            // Test database connection first
            await prisma.$connect()
            console.log('[NextAuth Session] ✅ Database connection OK')
            
            const dbUser = await prisma.user.findUnique({
              where: { id: (user as any).id },
              include: {
                accounts: {
                  take: 1,
                },
                _count: {
                  select: {
                    posts: true,
                    following: true,
                    followers: true,
                  },
                },
              },
            })

            console.log('[NextAuth Session] dbUser found:', !!dbUser, 'userID:', dbUser?.userID, 'email:', dbUser?.email)
            
            // Prevent guest account from being used automatically
            if (dbUser && dbUser.userID === 'guest') {
              console.log('[NextAuth Session] ⚠️ Guest account detected, this should not be used for OAuth login')
              // Don't set guest userID in session - let it redirect to register
              session.user.id = dbUser.id
              session.user.name = dbUser.name
              session.user.image = dbUser.image
              // Don't set userID for guest - this will trigger registration
              return session
            }

            if (dbUser) {
              session.user.id = dbUser.id
              session.user.userID = dbUser.userID || ''
              session.user.image = dbUser.image
              session.user.name = dbUser.name
              // Type assertion for extended session properties
              const extendedUser = session.user as any
              extendedUser.bio = dbUser.bio
              extendedUser.coverImage = dbUser.coverImage
              extendedUser.postsCount = dbUser._count.posts
              extendedUser.followingCount = dbUser._count.following
              extendedUser.followersCount = dbUser._count.followers
              // Store provider for registration API
              extendedUser.provider = dbUser.accounts[0]?.provider || dbUser.provider || ''
            } else {
              console.log('[NextAuth Session] dbUser not found for id:', (user as any).id)
            }
          } catch (dbError) {
            console.error('[NextAuth Session] Database query error:', dbError)
            if (dbError instanceof Error) {
              console.error('[NextAuth Session] Database error message:', dbError.message)
              console.error('[NextAuth Session] Database error stack:', dbError.stack)
            }
            // Continue with session even if database query fails
          }
        } else {
          console.log('[NextAuth Session] Missing session.user or user')
        }
      } catch (error) {
        console.error('[NextAuth Session] Error in session callback:', error)
        if (error instanceof Error) {
          console.error('[NextAuth Session] Error message:', error.message)
          console.error('[NextAuth Session] Error stack:', error.stack)
        }
        // Return session even if there's an error
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', // Custom error page
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}

