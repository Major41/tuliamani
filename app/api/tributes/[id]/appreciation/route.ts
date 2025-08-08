import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import Tribute from "@/models/tribute"
import { cookies } from "next/headers"
import { getUserFromCookies } from "@/lib/auth"

export async function POST(req: Request, { params }: { params: { id: string }}) {
  await getDb()
  const me = await getUserFromCookies(await cookies())
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const tribute = await Tribute.findById(params.id)
  if (!tribute) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (String(tribute.userId) !== String(me._id)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  // allowed after 30 days since publish
  const baseDate = tribute.publishedAt || tribute.createdAt
  const ok = baseDate && (Date.now() - new Date(baseDate).getTime()) >= 1000*60*60*24*30
  if (!ok) return NextResponse.json({ error: "Available after 30 days" }, { status: 403 })
  const { message } = await req.json()
  tribute.appreciationMessage = message
  await tribute.save()
  return NextResponse.json({ tribute })
}
