import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { requireRoleUser } from "@/lib/auth"
import { getDb } from "@/lib/db"
import LegacyOrder from "@/models/legacy-order"

export async function POST(req: Request, { params }: { params: { id: string }}) {
  const { isAdmin } = await requireRoleUser(await cookies(), ["admin"])
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  await getDb()
  const { designerUserId } = await req.json()
  const order = await LegacyOrder.findByIdAndUpdate(params.id, { status: "assigned", assignedToUserId: designerUserId }, { new: true })
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ order })
}
