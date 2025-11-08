import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    // Create a session token
    const sessionToken = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    // Create session in database
    const session = await prisma.session.create({
      data: {
        sessionToken,
        userId: userId,
        expires,
      },
      include: {
        user: true,
      },
    })

    // Get the cookie name (NextAuth uses different names in dev vs prod)
    // NextAuth v4 uses: next-auth.session-token (dev) or __Secure-next-auth.session-token (prod)
    const isProduction = process.env.NODE_ENV === 'production'
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const isSecure = baseUrl.startsWith('https://')
    
    const cookieName = isProduction && isSecure
      ? '__Secure-next-auth.session-token' 
      : 'next-auth.session-token'

    // Set session cookie with proper NextAuth format
    const cookieOptions = [
      `${cookieName}=${sessionToken}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      `Max-Age=${30 * 24 * 60 * 60}`,
    ]
    
    if (isProduction && isSecure) {
      cookieOptions.push('Secure')
    }
    
    res.setHeader('Set-Cookie', cookieOptions.join('; '))

    return res.status(200).json({
      success: true,
      session: {
        sessionToken,
        expires: session.expires,
        user: session.user,
      },
    })
  } catch (error) {
    console.error('Create session error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

