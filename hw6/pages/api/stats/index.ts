import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '@/lib/db'
import Stats from '@/models/Stats'
import User from '@/models/User'
import Conversation from '@/models/Conversation'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await connectDB()

    // Get today's stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let todayStats = await Stats.findOne({ date: today })

    if (!todayStats) {
      todayStats = await Stats.create({
        date: today,
        totalMessages: 0,
        totalUsers: 0,
        totalConversations: 0,
        llmCalls: 0,
        llmErrors: 0,
        averageResponseTime: 0,
      })
    }

    // Get overall stats
    const totalUsers = await User.countDocuments()
    const totalConversations = await Conversation.countDocuments()
    const activeConversations = await Conversation.countDocuments({ status: 'active' })

    // Calculate total messages
    const conversations = await Conversation.find({})
    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0)

    res.status(200).json({
      today: todayStats,
      overall: {
        totalUsers,
        totalConversations,
        activeConversations,
        totalMessages,
      },
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

