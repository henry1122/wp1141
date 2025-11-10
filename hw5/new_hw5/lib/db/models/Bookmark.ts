import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBookmark extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  folderName?: string; // 收藏資料夾名稱
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
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
    folderName: {
      type: String,
      default: "default", // 默認資料夾
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// 複合索引：確保同一用戶在同一資料夾中不能重複收藏同一篇文章
BookmarkSchema.index({ userId: 1, postId: 1, folderName: 1 }, { unique: true });

const Bookmark: Model<IBookmark> =
  mongoose.models.Bookmark || mongoose.model<IBookmark>("Bookmark", BookmarkSchema);

export default Bookmark;


