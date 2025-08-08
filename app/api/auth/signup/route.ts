import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import User from "@/models/user"
import { hashPassword, signJwtCookie } from "@/lib/auth"

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json()
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  await getDb()
  const exists = await User.findOne({ email })
  if (exists) return NextResponse.json({ error: "Email taken" }, { status: 400 })
  const passwordHash = await hashPassword(password)
  const isAdmin = role === "admin" // only allow if you seed or restrict later
  const user = await User.create({ name, email, passwordHash, role: isAdmin ? "admin":"user" })
  const res = NextResponse.json({ ok: true })
  await signJwtCookie(res, { _id: String(user._id), role: user.role, email: user.email, name: user.name })
  return res
}
