import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IDraft extends Document {
  userId: Types.ObjectId;
  content: string;
  savedAt: Date;
}

const DraftSchema = new Schema<IDraft>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

DraftSchema.index({ userId: 1, savedAt: -1 });

const Draft: Model<IDraft> = mongoose.models.Draft || mongoose.model<IDraft>("Draft", DraftSchema);

export default Draft;

