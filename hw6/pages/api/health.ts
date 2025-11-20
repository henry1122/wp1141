import type { NextApiRequest, NextApiResponse } from 'next'
import { llmService } from '@/lib/services/llmService'
import connectDB from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Check database connection
    let dbStatus = 'ok'
    try {
      await connectDB()
    } catch (error) {
      dbStatus = 'error'
    }

    // Check LLM service
    const llmStatus = llmService.isAvailable() ? 'ok' : 'unavailable'

    const health = {
      status: dbStatus === 'ok' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        llm: llmStatus,
      },
    }

    const statusCode = health.status === 'healthy' ? 200 : 503
    res.status(statusCode).json(health)
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    })
  }
}

