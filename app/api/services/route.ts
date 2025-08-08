import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import Service from "@/models/service"
import { cookies } from "next/headers"
import { requireAuthUser } from "@/lib/auth"

export async function GET(req: Request) {
  await getDb()
  const url = new URL(req.url)
  const category = url.searchParams.get("category")
  const filter:any = { status: "published" }
  if (category) filter.category = category
  const services = await Service.find(filter).sort({ createdAt: -1 }).lean()
  return NextResponse.json({ services })
}

export async function POST(req: Request) {
  const me = await requireAuthUser(await cookies())
  await getDb()
  const body = await req.json()
  const created = await Service.create({
    businessName: body.businessName,
    category: body.category,
    description: body.description,
    contact: body.contact,
    mpesaCode: body.mpesaCode,
    logo: body.logo,
    userId: me._id,
    status: "pending",
    paid: false,
  })
  return NextResponse.json({ service: created })
}
