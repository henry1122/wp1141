import type { NextApiRequest, NextApiResponse } from 'next'
import { conversationService } from '@/lib/services/conversationService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const conversation = await conversationService.getConversationById(id as string)

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' })
      }

      res.status(200).json(conversation)
    } catch (error) {
      console.error('Get conversation error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const conversation = await conversationService.endConversation(id as string)

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' })
      }

      res.status(200).json({ message: 'Conversation ended', conversation })
    } catch (error) {
      console.error('End conversation error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

