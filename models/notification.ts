import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface INotification extends Document {
  userId: Schema.Types.ObjectId
  type: string
  message: string
  scheduledFor: Date
  sentAt?: Date
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  type: String,
  message: String,
  scheduledFor: Date,
  sentAt: Date,
}, { timestamps: true })

export default (mongoose.models.Notification as Model<INotification>) || mongoose.model<INotification>("Notification", NotificationSchema)
