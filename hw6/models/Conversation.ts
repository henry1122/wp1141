import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    messageId?: string
    replyToken?: string
    [key: string]: any
  }
}

export interface IConversation extends Document {
  lineUserId: string
  messages: IMessage[]
  status: 'active' | 'ended'
  startedAt: Date
  endedAt?: Date
  metadata?: {
    platform: string
    [key: string]: any
  }
}

const MessageSchema: Schema = new Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { _id: false }
)

const ConversationSchema: Schema = new Schema(
  {
    lineUserId: {
      type: String,
      required: true,
      index: true,
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'ended'],
      default: 'active',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: Date,
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient querying
ConversationSchema.index({ lineUserId: 1, createdAt: -1 })
ConversationSchema.index({ status: 1, createdAt: -1 })

export default mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', ConversationSchema)

