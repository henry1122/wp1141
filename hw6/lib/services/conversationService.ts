import connectDB from '@/lib/db'
import User, { IUser } from '@/models/User'
import Conversation, { IConversation, IMessage } from '@/models/Conversation'
import Stats from '@/models/Stats'

export interface ConversationFilter {
  lineUserId?: string
  status?: 'active' | 'ended'
  startDate?: Date
  endDate?: Date
  limit?: number
  skip?: number
}

export class ConversationService {
  async getOrCreateUser(lineUserId: string, userInfo?: Partial<IUser>): Promise<IUser> {
    await connectDB()

    let user = await User.findOne({ lineUserId })

    if (!user) {
      user = await User.create({
        lineUserId,
        ...userInfo,
      })
    } else if (userInfo) {
      // Update user info if provided
      Object.assign(user, userInfo)
      await user.save()
    }

    return user
  }

  async getActiveConversation(lineUserId: string): Promise<IConversation | null> {
    await connectDB()

    return await Conversation.findOne({
      lineUserId,
      status: 'active',
    }).sort({ createdAt: -1 })
  }

  async createConversation(
    lineUserId: string,
    initialMessage?: IMessage,
    metadata?: any
  ): Promise<IConversation> {
    await connectDB()

    const conversation = await Conversation.create({
      lineUserId,
      messages: initialMessage ? [initialMessage] : [],
      status: 'active',
      metadata: {
        platform: 'line',
        ...metadata,
      },
    })

    await this.updateStats('conversation_created')

    return conversation
  }

  async addMessage(
    conversationId: string,
    message: IMessage
  ): Promise<IConversation | null> {
    await connectDB()

    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      return null
    }

    conversation.messages.push(message)
    await conversation.save()

    await this.updateStats('message_added')

    return conversation
  }

  async getConversationById(conversationId: string): Promise<IConversation | null> {
    await connectDB()

    return await Conversation.findById(conversationId)
  }

  async getConversations(filter: ConversationFilter): Promise<{
    conversations: IConversation[]
    total: number
  }> {
    await connectDB()

    const query: any = {}

    if (filter.lineUserId) {
      query.lineUserId = filter.lineUserId
    }

    if (filter.status) {
      query.status = filter.status
    }

    if (filter.startDate || filter.endDate) {
      query.createdAt = {}
      if (filter.startDate) {
        query.createdAt.$gte = filter.startDate
      }
      if (filter.endDate) {
        query.createdAt.$lte = filter.endDate
      }
    }

    const total = await Conversation.countDocuments(query)

    const conversations = await Conversation.find(query)
      .sort({ createdAt: -1 })
      .limit(filter.limit || 50)
      .skip(filter.skip || 0)

    return { conversations, total }
  }

  async endConversation(conversationId: string): Promise<IConversation | null> {
    await connectDB()

    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      return null
    }

    conversation.status = 'ended'
    conversation.endedAt = new Date()
    await conversation.save()

    return conversation
  }

  async getRecentMessages(
    conversationId: string,
    limit: number = 10
  ): Promise<IMessage[]> {
    await connectDB()

    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      return []
    }

    return conversation.messages.slice(-limit)
  }

  async updateStats(event: 'message_added' | 'conversation_created' | 'llm_call' | 'llm_error'): Promise<void> {
    await connectDB()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const stats = await Stats.findOneAndUpdate(
      { date: today },
      {
        $inc: {
          ...(event === 'message_added' && { totalMessages: 1 }),
          ...(event === 'conversation_created' && { totalConversations: 1 }),
          ...(event === 'llm_call' && { llmCalls: 1 }),
          ...(event === 'llm_error' && { llmErrors: 1 }),
        },
      },
      { upsert: true, new: true }
    )

    // Update total users count
    if (event === 'conversation_created') {
      const userCount = await User.countDocuments()
      stats.totalUsers = userCount
      await stats.save()
    }
  }
}

export const conversationService = new ConversationService()

