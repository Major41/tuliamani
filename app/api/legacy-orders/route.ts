import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getDb } from "@/lib/db"
import LegacyOrder from "@/models/legacy-order"
import { getUserFromCookies, requireAuthUser, requireRoleUser } from "@/lib/auth"

export async function GET() {
  await getDb()
  const me = await getUserFromCookies(await cookies())
  let filter:any = {}
  if (!me) filter.status = "published" // fallback; usually admins or users fetch their own
  else if (me.role !== "admin") filter.userId = me._id
  const orders = await LegacyOrder.find(filter).sort({ createdAt: -1 }).lean()
  return NextResponse.json({ orders })
}

export async function POST(req: Request) {
  const me = await requireAuthUser(await cookies())
  await getDb()
  const body = await req.json()
  const created = await LegacyOrder.create({
    ...body,
    userId: me._id,
    status: "pending",
  })
  return NextResponse.json({ order: created })
}
