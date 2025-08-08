import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IComment extends Document {
  tributeId: Schema.Types.ObjectId
  message: string
  authorName: string
  authorEmail?: string
  authorPhone?: string
}

const CommentSchema = new Schema<IComment>({
  tributeId: { type: Schema.Types.ObjectId, ref: "Obituary", index: true },
  message: { type: String, required: true },
  authorName: { type: String, required: true },
  authorEmail: { type: String, optional: true },
  authorPhone: { type: String, optional: true },
}, { timestamps: true })

export default (mongoose.models.Comment as Model<IComment>) || mongoose.model<IComment>("Comment", CommentSchema)
