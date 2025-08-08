import { NextResponse } from "next/server"
import { clearJwtCookie } from "@/lib/auth"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  clearJwtCookie(res)
  return res
}
