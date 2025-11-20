import type { NextApiRequest, NextApiResponse } from 'next'
import { conversationService } from '@/lib/services/conversationService'
import { z } from 'zod'

const QuerySchema = z.object({
  lineUserId: z.string().optional(),
  status: z.enum(['active', 'ended']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.string().optional(),
  skip: z.string().optional(),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const query = QuerySchema.parse(req.query)

    const filter = {
      lineUserId: query.lineUserId,
      status: query.status,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      limit: query.limit ? parseInt(query.limit, 10) : 50,
      skip: query.skip ? parseInt(query.skip, 10) : 0,
    }

    const result = await conversationService.getConversations(filter)

    res.status(200).json(result)
  } catch (error) {
    console.error('Get conversations error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

