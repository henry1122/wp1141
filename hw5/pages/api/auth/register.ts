import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions, userIDSchema } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { userID } = req.body

    // Validate userID
    const validatedUserID = userIDSchema.parse(userID)

    // Check if userID is already taken
    const existingUser = await prisma.user.findUnique({
      where: { userID: validatedUserID },
    })

    if (existingUser) {
      return res.status(400).json({ error: 'UserID already taken' })
    }

    // Find the current user by session user ID
    // This ensures we get the correct user for the current OAuth session
    // Different OAuth providers create different user accounts
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        accounts: {
          take: 1,
        },
      },
    })

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found. Please sign in again.' })
    }

    // Check if user already has a userID with different provider
    const existingUserWithID = await prisma.user.findUnique({
      where: { userID: validatedUserID },
    })

    if (existingUserWithID && existingUserWithID.id !== currentUser.id) {
      return res.status(400).json({ error: 'UserID already taken' })
    }

    // Get the account to find provider
    const account = currentUser.accounts[0]
    if (!account) {
      return res.status(400).json({ error: 'Account not found' })
    }

    // Update user with userID
    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        userID: validatedUserID,
        provider: account.provider,
      },
    })

      return res.status(200).json({ user })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid userID format. Must be 3-20 characters, alphanumeric and underscore only.' })
    }
    console.error('Registration error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

