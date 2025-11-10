import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userID } = req.body

    if (!userID) {
      return res.status(400).json({ error: 'userID is required' })
    }

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

    // If user has credentials provider, we need to create a proper NextAuth session
    if (user.provider === 'credentials' || user.accounts[0]?.provider === 'credentials') {
      // Return user info - frontend will handle session creation
      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          userID: user.userID,
          email: user.email,
          name: user.name,
          image: user.image,
          provider: 'credentials',
        },
        message: 'Login successful - please use OAuth or create session manually',
        needsManualSession: true,
      })
    }

    // For OAuth users, return user info with provider info
    // Frontend will use this to trigger OAuth signIn with the correct provider
    if (!user.accounts.length) {
      return res.status(404).json({ error: 'No account found for this userID' })
    }

    const provider = user.accounts[0].provider
    
    return res.status(200).json({ 
      success: true,
      user: {
        id: user.id,
        userID: user.userID,
        email: user.email,
        name: user.name,
        image: user.image,
        provider: provider,
      },
      provider: provider, // Tell frontend which provider to use
      needsOAuthSignIn: true, // Frontend should trigger OAuth signIn
    })
  } catch (error) {
    console.error('Login error:', error)
    
    // Provide more detailed error information
    let errorMessage = 'Internal server error'
    let errorDetails = 'Unknown error'
    
    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack || error.message
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
      
      // Check for specific error types
      if (error.message.includes('DATABASE_URL') || error.message.includes('not set')) {
        errorMessage = 'Database connection error: DATABASE_URL is not configured'
      } else if (error.message.includes('timeout') || error.message.includes('No available servers')) {
        errorMessage = 'Database connection timeout: Cannot connect to MongoDB'
      } else if (error.message.includes('Prisma')) {
        errorMessage = 'Database error: ' + error.message
      }
    }
    
    return res.status(500).json({ 
      error: errorMessage,
      details: errorDetails,
      help: 'Please check: 1. Database connection 2. Environment variables 3. Server logs'
    })
  }
}


