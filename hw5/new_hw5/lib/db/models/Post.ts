import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ILink {
  url: string;
  displayLength: number;
}

export interface IPost extends Document {
  authorId: Types.ObjectId;
  content: string;
  hashtags: string[];
  mentions: string[];
  links: ILink[];
  parentPostId?: Types.ObjectId;
  isRepost: boolean;
  originalPostId?: Types.ObjectId;
  imageUrls?: string[]; // 圖片 URLs（支持多張圖片）
  createdAt: Date;
  updatedAt: Date;
}

const LinkSchema = new Schema<ILink>(
  {
    url: {
      type: String,
      required: true,
    },
    displayLength: {
      type: Number,
      default: 23,
    },
  },
  { _id: false }
);

const PostSchema = new Schema<IPost>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: false, // 允許空字串（如果有圖片）
      maxlength: 280,
      default: "",
    },
    hashtags: {
      type: [String],
      index: true,
      default: [],
    },
    mentions: {
      type: [String],
      index: true,
      default: [],
    },
    links: {
      type: [LinkSchema],
      default: [],
    },
    parentPostId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      index: true,
    },
    isRepost: {
      type: Boolean,
      default: false,
    },
    originalPostId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    imageUrls: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

PostSchema.index({ createdAt: -1 });
PostSchema.index({ authorId: 1, createdAt: -1 });
PostSchema.index({ parentPostId: 1, createdAt: -1 });

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;

