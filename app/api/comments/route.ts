import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import Tribute from "@/models/tribute"
import Comment from "@/models/comment"

export async function POST(req: Request) {
  await getDb()
  const form = await req.formData()
  const tributeId = String(form.get("tributeId") || "")
  const message = String(form.get("message") || "")
  if (!tributeId || !message) return NextResponse.redirect(new URL(req.url).origin)
  const tribute = await Tribute.findById(tributeId)
  if (!tribute) return NextResponse.redirect(new URL(req.url).origin)
  if (!tribute.allowPublicTributes || tribute.status === "memorialized") {
    return NextResponse.redirect(new URL(`/tributes/${tributeId}`, req.url))
  }
  await Comment.create({ tributeId, message })
  return NextResponse.redirect(new URL(`/tributes/${tributeId}`, req.url))
}
