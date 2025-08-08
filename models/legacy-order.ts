import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ILegacyOrder extends Document {
  userId: Schema.Types.ObjectId
  tributeId?: Schema.Types.ObjectId
  deceasedName: string
  requesterName: string
  contact: string
  description?: string
  deadline?: string
  packageType: "design" | "full"
  mpesaCode?: string
  status: "pending" | "approved" | "assigned" | "completed"
  assignedToUserId?: Schema.Types.ObjectId
  zipBook?: { url: string; public_id: string }
}

const LegacyOrderSchema = new Schema<ILegacyOrder>({
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  tributeId: { type: Schema.Types.ObjectId, ref: "Tribute" },
  deceasedName: String,
  requesterName: String,
  contact: String,
  description: String,
  deadline: String,
  packageType: { type: String, enum: ["design","full"], default: "design" },
  mpesaCode: String,
  status: { type: String, enum: ["pending","approved","assigned","completed"], default: "pending", index: true },
  assignedToUserId: { type: Schema.Types.ObjectId, ref: "User" },
  zipBook: { url: String, public_id: String },
}, { timestamps: true })

export default (mongoose.models.LegacyOrder as Model<ILegacyOrder>) || mongoose.model<ILegacyOrder>("LegacyOrder", LegacyOrderSchema)
