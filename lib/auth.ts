import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { NextResponse } from "next/server"
import { cookies as nextCookies } from "next/headers"
import User from "@/models/user"
import { getDb } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface UserPayload {
  _id: string
  role: string
  email: string
  name: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function signJwtCookie(res: NextResponse, payload: UserPayload) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })

  res.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function getUserFromCookies(cookieStore: any): Promise<UserPayload | null> {
  try {
    const token = cookieStore.get("auth-token")?.value
    if (!token) return null

    const payload = jwt.verify(token, JWT_SECRET) as UserPayload
    return payload
  } catch (error) {
    console.error("Error verifying JWT:", error)
    return null
  }
}

export async function requireAuthUser(cookieStore: any): Promise<UserPayload> {
  const user = await getUserFromCookies(cookieStore)
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireRoleUser(
  cookieStore: any,
  roles: string[],
  throwOnForbidden = true,
): Promise<{ user: UserPayload | null; isAdmin: boolean; hasRole: boolean }> {
  const user = await getUserFromCookies(cookieStore)
  const hasRole = !!user && roles.includes(user.role)
  const isAdmin = user?.role === "admin"

  if (!hasRole && throwOnForbidden) {
    throw new Error("Forbidden")
  }

  return { user, isAdmin, hasRole }
}

export async function getUser() {
  const cookieStore = await nextCookies()
  return getUserFromCookies(cookieStore)
}

export async function requireAuth(cookieStore: any) {
  const user = await getUserFromCookies(cookieStore)
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireAdmin(cookieStore: any) {
  const user = await requireAuth(cookieStore)
  if (user.role !== "admin") {
    throw new Error("Admin access required")
  }
  return user
}

export async function getUserById(userId: string) {
  try {
    await getDb()
    const user = await User.findById(userId).select("-passwordHash").lean()
    return user
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    return null
  }
}

export function clearJwtCookie(res: NextResponse) {
  res.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
}
