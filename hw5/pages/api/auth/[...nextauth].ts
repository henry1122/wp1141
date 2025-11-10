import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Wrap NextAuth handler with error handling
const handler = NextAuth(authOptions)

export default async function authHandler(req: any, res: any) {
  try {
    // Log request details for debugging
    if (req.method === 'GET' && req.url?.includes('/callback')) {
      console.log('[NextAuth API] ===== Callback Request =====')
      console.log('[NextAuth API] URL:', req.url)
      console.log('[NextAuth API] Query:', req.query)
      console.log('[NextAuth API] NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
      console.log('[NextAuth API] NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing')
      console.log('[NextAuth API] GITHUB_ID:', process.env.GITHUB_ID ? 'Set' : 'Missing')
      console.log('[NextAuth API] GITHUB_SECRET:', process.env.GITHUB_SECRET ? 'Set' : 'Missing')
    }
    
    return await handler(req, res)
  } catch (error) {
    console.error('❌ NextAuth API Error:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    // Return error response
    return res.status(500).json({ 
      error: 'Authentication error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
