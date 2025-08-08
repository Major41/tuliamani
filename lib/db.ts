import mongoose from "mongoose"

let connPromise: Promise<typeof mongoose> | null = null

export async function getDb() {
  if (mongoose.connection.readyState === 1) return mongoose
  if (!connPromise) {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error("MONGODB_URI not set")
    connPromise = mongoose.connect(uri, { dbName: "tuliamani" })
  }
  return connPromise
}
