import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IRepost extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  createdAt: Date;
}

const RepostSchema = new Schema<IRepost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// 複合唯一索引：同一使用者不能對同一篇文章轉發兩次
RepostSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Repost: Model<IRepost> = mongoose.models.Repost || mongoose.model<IRepost>("Repost", RepostSchema);

export default Repost;

