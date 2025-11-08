import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    if (!user || !user.accounts.length) {
      return res.status(404).json({ error: 'User not found' })
    }

    // In a real app, you'd verify password/credentials here
    // For this implementation, we'll rely on OAuth session
    return res.status(200).json({ user })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


