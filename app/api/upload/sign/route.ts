import { NextResponse } from "next/server"
import crypto from "node:crypto"

export async function POST(req: Request) {
  const { folder = "tuliamani", resourceType = "image" } = await req.json()
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!
  const apiKey = process.env.CLOUDINARY_API_KEY!
  const apiSecret = process.env.CLOUDINARY_API_SECRET!
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 })
  }
  const timestamp = Math.floor(Date.now() / 1000)
  // signature of "folder=...&timestamp=..."
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret ? "" : ""}`
  const signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex")
  return NextResponse.json({ timestamp, signature, apiKey, cloudName, folder, resourceType })
}
