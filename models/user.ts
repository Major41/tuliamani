import mongoose, { Schema, type Model, type Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  passwordHash: string
  role: "user" | "admin"
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user","admin"], default: "user" },
}, { timestamps: true })

export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema)
