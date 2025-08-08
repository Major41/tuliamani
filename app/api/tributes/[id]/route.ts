import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import Tribute from "@/models/tribute"
import { cookies } from "next/headers"
import { getUserFromCookies, requireRoleUser } from "@/lib/auth"

export async function GET(_: Request, { params }: { params: { id: string }}) {
  await getDb()
  const tribute = await Tribute.findById(params.id).lean()
  if (!tribute) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ tribute })
}

export async function PUT(req: Request, { params }: { params: { id: string }}) {
  await getDb()
  const tribute = await Tribute.findById(params.id)
  if (!tribute) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const me = await getUserFromCookies(await cookies())
  const { isAdmin } = await requireRoleUser(await cookies(), ["admin"], false)
  if (!me || (String(tribute.userId) !== String(me._id) && !isAdmin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const body = await req.json()
  const allowed = ["name", "dob", "dod", "epitaph", "eulogy", "funeralInfo", "allowPublicTributes"]
  allowed.forEach((k)=> { if (k in body) (tribute as any)[k] = body[k] })
  await tribute.save()
  return NextResponse.json({ tribute })
}
