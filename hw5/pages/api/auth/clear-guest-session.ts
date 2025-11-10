import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// API endpoint to clear guest account session
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Find guest user
    const guestUser = await prisma.user.findUnique({
      where: { userID: 'guest' },
    })

    if (!guestUser) {
      return res.status(200).json({ message: 'Guest user not found, nothing to clear' })
    }

    // Delete all sessions for guest user
    const deletedSessions = await prisma.session.deleteMany({
      where: { userId: guestUser.id },
    })

    console.log(`✅ Cleared ${deletedSessions.count} session(s) for guest user`)

    return res.status(200).json({ 
      success: true,
      message: `Cleared ${deletedSessions.count} session(s) for guest user`,
      deletedCount: deletedSessions.count
    })
  } catch (error) {
    console.error('Error clearing guest session:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

