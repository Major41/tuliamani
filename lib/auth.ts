import { cookies as nextCookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const COOKIE_NAME = "tuliamani_token"

export async function hashPassword(pw: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(pw, salt)
}
export async function comparePassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash)
}

type JwtPayload = { _id: string; role: "user" | "admin"; email: string; name: string }

export async function signJwtCookie(res: NextResponse, payload: JwtPayload) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET not set")
  const token = jwt.sign(payload, secret, { expiresIn: "7d" })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true, sameSite: "lax", secure: true, path: "/",
    maxAge: 60*60*24*7
  })
}

export function clearJwtCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 0 })
}

export async function getUserFromCookies(cookieStore: Awaited<ReturnType<typeof nextCookies>>) {
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const secret = process.env.JWT_SECRET!
    const data = jwt.verify(token, secret) as JwtPayload
    return data
  } catch {
    return null
  }
}

export async function requireAuthUser(cookieStore: Awaited<ReturnType<typeof nextCookies>>) {
  const user = await getUserFromCookies(cookieStore)
  if (!user) throw new Error("Unauthorized")
  return user
}

export async function requireRoleUser(cookieStore: Awaited<ReturnType<typeof nextCookies>>, roles: Array<"user"|"admin">, throwOnForbidden = true) {
  const user = await getUserFromCookies(cookieStore)
  const hasRole = !!user && roles.includes(user.role)
  if (!hasRole && throwOnForbidden) throw new Error("Forbidden")
  return { user, isAdmin: user?.role === "admin", hasRole }
}
