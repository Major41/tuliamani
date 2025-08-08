import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IService extends Document {
  businessName: string
  category: string
  description?: string
  logo?: { url: string; public_id: string }
  contact?: { name?: string; phone?: string; email?: string }
  mpesaCode?: string
  status: "pending" | "published" | "archived"
  paid: boolean
  userId: Schema.Types.ObjectId
  approvedAt?: Date
}

const ServiceSchema = new Schema<IService>({
  businessName: { type: String, required: true },
  category: { type: String, index: true },
  description: String,
  logo: { url: String, public_id: String },
  contact: { name: String, phone: String, email: String },
  mpesaCode: String,
  status: { type: String, enum: ["pending","published","archived"], default: "pending", index: true },
  paid: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  approvedAt: Date,
}, { timestamps: true })

export default (mongoose.models.Service as Model<IService>) || mongoose.model<IService>("Service", ServiceSchema)
