import { Client, middleware, WebhookEvent, TextMessage, Message } from '@line/bot-sdk'
import { z } from 'zod'

const LineConfigSchema = z.object({
  channelAccessToken: z.string().min(1),
  channelSecret: z.string().min(1),
})

export type LineConfig = z.infer<typeof LineConfigSchema>

export class LineService {
  private client: Client
  private config: LineConfig

  constructor() {
    const config = {
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
      channelSecret: process.env.LINE_CHANNEL_SECRET || '',
    }

    this.config = LineConfigSchema.parse(config)

    this.client = new Client({
      channelAccessToken: this.config.channelAccessToken,
      channelSecret: this.config.channelSecret,
    })
  }

  getMiddleware() {
    return middleware(this.config)
  }

  async replyMessage(replyToken: string, messages: Message | Message[]): Promise<void> {
    try {
      await this.client.replyMessage(replyToken, messages)
    } catch (error) {
      console.error('Line reply error:', error)
      throw error
    }
  }

  async pushMessage(userId: string, messages: Message | Message[]): Promise<void> {
    try {
      await this.client.pushMessage(userId, messages)
    } catch (error) {
      console.error('Line push error:', error)
      throw error
    }
  }

  async getUserProfile(userId: string) {
    try {
      return await this.client.getProfile(userId)
    } catch (error) {
      console.error('Line getProfile error:', error)
      return null
    }
  }

  extractTextMessage(event: WebhookEvent): string | null {
    if (event.type === 'message' && event.message.type === 'text') {
      return (event.message as TextMessage).text
    }
    return null
  }

  getUserId(event: WebhookEvent): string | null {
    if ('source' in event && event.source.type === 'user') {
      return event.source.userId
    }
    return null
  }

  getReplyToken(event: WebhookEvent): string | null {
    if ('replyToken' in event) {
      return event.replyToken
    }
    return null
  }
}

export const lineService = new LineService()

