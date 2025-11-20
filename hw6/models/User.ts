import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  lineUserId: string
  displayName?: string
  pictureUrl?: string
  statusMessage?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    lineUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    displayName: String,
    pictureUrl: String,
    statusMessage: String,
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

