import { NextResponse } from "next/server";
import User from "@/models/user";
import { getDb } from "@/lib/db";
import { comparePassword, signJwtCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await getDb();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Prepare the response with the role
  const res = NextResponse.json({
    ok: true,
    role: user.role, // ✅ Pass role to frontend
  });

  // Sign JWT cookie with user data
  await signJwtCookie(res, {
    _id: String(user._id),
    role: user.role,
    email: user.email,
    name: user.name,
  });

  return res;
}
