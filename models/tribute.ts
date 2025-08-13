import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IImage {
  url: string
  public_id: string
  type: "portrait" | "gallery"
}
export interface ITribute extends Document {
  userId: Schema.Types.ObjectId
  name: string
  dob: string
  dod: string
  epitaph?: string
  eulogy: string
  images: IImage[]
  funeralInfo?: { venue?: string; time?: string; streamingLink?: string }
  contributor?: { name?: string; phone?: string; email?: string }
  mpesaCode?: string
  allowPublicTributes: boolean
  status: "pending" | "approved" | "published" | "memorialized" | "archived" | "rejected"
  paid: boolean
  appreciationMessage?: string
  publishedAt?: Date
  memorializedAt?: Date
  archivedAt?: Date
}

const ImageSchema = new Schema<IImage>({
  url: String,
  public_id: String,
  type: { type: String, enum: ["portrait","gallery"], default: "gallery" }
}, { _id: false })

const TributeSchema = new Schema<ITribute>({
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  name: { type: String, required: true },
  dob: String,
  dod: String,
  epitaph: String,
  eulogy: { type: String, required: true },
  images: [ImageSchema],
  funeralInfo: { venue: String, time: String, streamingLink: String },
  contributor: { name: String, phone: String, email: String },
  mpesaCode: String,
  allowPublicTributes: { type: Boolean, default: true },
  status: { type: String, enum: ["pending","approved","published","memorialized","archived"], default: "pending", index: true },
  paid: { type: Boolean, default: false },
  appreciationMessage: String,
  publishedAt: Date,
  memorializedAt: Date,
  archivedAt: Date,
}, { timestamps: true })

export default (mongoose.models.Tribute as Model<ITribute>) || mongoose.model<ITribute>("Tribute", TributeSchema)
