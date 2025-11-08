import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import FacebookProvider from 'next-auth/providers/facebook'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import { z } from 'zod'

const userIDSchema = z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/)

// Wrap adapter initialization in try-catch to catch any errors
let adapter: any
try {
  adapter = PrismaAdapter(prisma) as any
  console.log('✅ PrismaAdapter initialized successfully')
} catch (error) {
  console.error('❌ Error initializing PrismaAdapter:', error)
  throw error
}

export const authOptions: NextAuthOptions = {
  adapter: adapter,
  debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Always allow sign in - PrismaAdapter will handle user creation
        // We'll check for userID in the redirect callback or session callback
        console.log('[NextAuth SignIn] User:', user.email, 'Provider:', account?.provider)
        if (!account || !user.email) {
          console.log('[NextAuth SignIn] Missing account or email, returning false')
          return false
        }
        console.log('[NextAuth SignIn] Allowing sign in')
        return true
      } catch (error) {
        console.error('[NextAuth SignIn] Error in signIn callback:', error)
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
        console.log('[NextAuth Redirect] url:', url, 'baseUrl:', baseUrl)
        
        // The url parameter from NextAuth is the callbackUrl we set in signIn()
        // It can be a relative path like '/auth/register' or an absolute URL
        
        // Normalize the URL
        let targetUrl = url || baseUrl
        
        // If url is explicitly '/auth/register', redirect there
        if (targetUrl === '/auth/register' || targetUrl === `${baseUrl}/auth/register`) {
          console.log('[NextAuth Redirect] Redirecting to /auth/register')
          return `${baseUrl}/auth/register`
        }
        
        // Check if url contains '/auth/register' (in case it's encoded or has query params)
        if (targetUrl && targetUrl.includes('/auth/register')) {
          console.log('[NextAuth Redirect] Found /auth/register in URL, redirecting')
          return `${baseUrl}/auth/register`
        }
        
        // Parse URL to check for callbackUrl in query params (NextAuth might store it there)
        try {
          const urlObj = new URL(targetUrl, baseUrl)
          const callbackUrl = urlObj.searchParams.get('callbackUrl')
          if (callbackUrl) {
            const decoded = decodeURIComponent(callbackUrl)
            console.log('[NextAuth Redirect] Found callbackUrl in query:', decoded)
            if (decoded.includes('/auth/register')) {
              return `${baseUrl}/auth/register`
            }
            // Use the decoded callbackUrl
            if (decoded.startsWith('/')) {
              return `${baseUrl}${decoded}`
            }
            if (decoded.startsWith('http') && decoded.includes(baseUrl)) {
              return decoded
            }
          }
        } catch (e) {
          // Not a valid URL, continue
        }
        
        // Handle relative URLs
        if (targetUrl && targetUrl.startsWith('/')) {
          return `${baseUrl}${targetUrl}`
        }
        
        // Handle absolute URLs from same origin
        if (targetUrl && targetUrl.startsWith('http')) {
          try {
            const urlObj = new URL(targetUrl)
            if (urlObj.origin === baseUrl) {
              return targetUrl
            }
          } catch (e) {
            // Invalid URL, continue
          }
        }
        
        // Default: redirect to home, let page component handle userID check
        console.log('[NextAuth Redirect] Default redirect to home')
        return `${baseUrl}/`
      } catch (error) {
        console.error('Error in redirect callback:', error)
        // Fallback to home page
        return `${baseUrl}/`
      }
    },
    async session({ session, user }) {
      try {
        console.log('[NextAuth Session] Called with user.id:', (user as any)?.id)
        if (session.user && user) {
          try {
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

            console.log('[NextAuth Session] dbUser found:', !!dbUser, 'userID:', dbUser?.userID)

            if (dbUser) {
              session.user.id = dbUser.id
              session.user.userID = dbUser.userID || ''
              session.user.image = dbUser.image
              session.user.name = dbUser.name
              session.user.bio = dbUser.bio
              session.user.coverImage = dbUser.coverImage
              session.user.postsCount = dbUser._count.posts
              session.user.followingCount = dbUser._count.following
              session.user.followersCount = dbUser._count.followers
              // Store provider for registration API
              session.user.provider = dbUser.accounts[0]?.provider || dbUser.provider || ''
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
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}

export { userIDSchema }

