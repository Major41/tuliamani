import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import Tribute from "@/models/tribute"
import Notification from "@/models/notification"

export async function POST(req: Request) {
  const auth = req.headers.get("x-cron-key")
  if (process.env.CRON_SECRET && auth !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  await getDb()
  const now = Date.now()
  const published = await Tribute.find({ status: "published" })
  let moved = 0
  for (const t of published) {
    const base = t.publishedAt || t.createdAt
    if (base && (now - new Date(base).getTime()) >= 1000*60*60*24*30) {
      t.status = "memorialized"
      t.memorializedAt = new Date()
      await t.save()
      await Notification.create({
        userId: t.userId,
        type: "memorialized",
        message: `Tribute "${t.name}" has been memorialized. You can add an appreciation message.`,
        scheduledFor: new Date()
      })
      moved++
    }
  }
  // 11 month reminders
  const elevenMonthAgo = new Date(now - 1000*60*60*24*30*11)
  const candidates = await Tribute.find({
    $or: [
      { memorializedAt: { $lte: elevenMonthAgo } },
      { publishedAt: { $lte: elevenMonthAgo }, status: "published" }
    ]
  })
  for (const t of candidates) {
    await Notification.create({
      userId: t.userId,
      type: "renewal",
      message: `Your memorial for "${t.name}" is eligible for ZIP download and extension.`,
      scheduledFor: new Date()
    })
  }
  return NextResponse.json({ ok: true, moved })
}
