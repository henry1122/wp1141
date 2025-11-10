import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  userID: string;
  provider: "google" | "github" | "facebook";
  providerAccountId: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  backgroundImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userID: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
      enum: ["google", "github", "facebook"],
    },
    providerAccountId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      sparse: true,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 160,
    },
    backgroundImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// 複合索引：同一 provider 下的 userID 必須唯一（但 userID 為空時不適用）
UserSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

