import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserFromCookies } from "@/lib/auth"
import { getDb } from "@/lib/db"
import LegacyOrder from "@/models/legacy-order"

export async function POST(req: Request, { params }: { params: { id: string }}) {
  const me = await getUserFromCookies(await cookies())
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await getDb()
  const body = await req.json()
  const order = await LegacyOrder.findById(params.id)
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (String(order.assignedToUserId) !== String(me._id) && me.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  order.zipBook = body.zipBook
  order.status = "completed"
  await order.save()
  return NextResponse.json({ order })
}
