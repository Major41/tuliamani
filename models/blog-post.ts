import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IBlogPost extends Document {
  title: string
  slug: string
  content: string
  category: string
  coverImage?: { url: string; public_id: string }
  author?: string
  published: boolean
}

const BlogPostSchema = new Schema<IBlogPost>({
  title: String,
  slug: { type: String, unique: true, index: true },
  content: String,
  category: String,
  coverImage: { url: String, public_id: String },
  author: String,
  published: { type: Boolean, default: false, index: true },
}, { timestamps: true })

export default (mongoose.models.BlogPost as Model<IBlogPost>) || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema)
