import { NextResponse } from "next/server"
import { getUserFromCookies } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const user = await getUserFromCookies(cookieStore)
  if (!user) return NextResponse.json({ user: null }, { status: 200 })
  return NextResponse.json({ user })
}
