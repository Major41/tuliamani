import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IComment extends Document {
  tributeId: Schema.Types.ObjectId;
  userId?: Schema.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  relationship?: string;
  message: string;
  type: "comment" | "tribute";
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    tributeId: {
      type: Schema.Types.ObjectId,
      ref: "Tribute",
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: String,
    phone: String,
    relationship: String,
    message: { type: String, required: true },
    type: { type: String, enum: ["comment", "tribute"], default: "comment" },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default (mongoose.models.Comment as Model<IComment>) ||
  mongoose.model<IComment>("Comment", CommentSchema);
