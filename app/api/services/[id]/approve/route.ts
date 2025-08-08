import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import Service from "@/models/service"
import { requireRoleUser } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(_: Request, { params }: { params: { id: string }}) {
  const { isAdmin } = await requireRoleUser(await cookies(), ["admin"])
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  await getDb()
  const service = await Service.findByIdAndUpdate(params.id, { status: "published", approvedAt: new Date() }, { new: true })
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ service })
}
