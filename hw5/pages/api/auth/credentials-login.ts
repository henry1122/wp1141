import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// This API creates a proper NextAuth session for credentials users
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userID } = req.body

    if (!userID) {
      return res.status(400).json({ error: 'userID is required' })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { userID },
      include: {
        accounts: {
          take: 1,
        },
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if user has credentials provider
    if (user.provider !== 'credentials' && user.accounts[0]?.provider !== 'credentials') {
      return res.status(400).json({ error: 'This endpoint is only for credentials users' })
    }

    // Create or get existing session
    // We'll create a session token and let NextAuth handle it
    const sessionToken = require('crypto').randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    // Check if session already exists
    let session = await prisma.session.findFirst({
      where: {
        userId: user.id,
        expires: {
          gt: new Date(),
        },
      },
    })

    // If no valid session, create one
    if (!session) {
      session = await prisma.session.create({
        data: {
          sessionToken,
          userId: user.id,
          expires,
        },
      })
    }

    // Set the session cookie that NextAuth expects
    const cookieName = process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL?.startsWith('https://')
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token'

    res.setHeader('Set-Cookie', [
      `${cookieName}=${session.sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}; ${process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL?.startsWith('https://') ? 'Secure;' : ''}`
    ])

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        userID: user.userID,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Credentials login error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

