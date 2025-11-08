import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Wrap NextAuth handler with error handling
const handler = NextAuth(authOptions)

export default async function authHandler(req: any, res: any) {
  try {
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
