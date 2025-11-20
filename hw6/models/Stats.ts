import mongoose, { Schema, Document } from 'mongoose'

export interface IStats extends Document {
  date: Date
  totalMessages: number
  totalUsers: number
  totalConversations: number
  llmCalls: number
  llmErrors: number
  averageResponseTime: number
}

const StatsSchema: Schema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
      index: true,
    },
    totalMessages: {
      type: Number,
      default: 0,
    },
    totalUsers: {
      type: Number,
      default: 0,
    },
    totalConversations: {
      type: Number,
      default: 0,
    },
    llmCalls: {
      type: Number,
      default: 0,
    },
    llmErrors: {
      type: Number,
      default: 0,
    },
    averageResponseTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Stats || mongoose.model<IStats>('Stats', StatsSchema)

