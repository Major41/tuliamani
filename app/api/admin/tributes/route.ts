import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireRoleUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import Comment from "@/models/comment";
import User from "@/models/user";

export async function GET(req: Request) {
  try {
    const { user, isAdmin } = await requireRoleUser(await cookies(), ["admin"]);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await getDb();

    const [tributes, users] = await Promise.all([
      Comment.find({})
        .populate("tributeId", "name images dob dod userId")
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
      User.find({}).select("_id name email").lean(),
    ]);

    const userMap = users.reduce((acc: any, user: any) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats = {
      total: tributes.length,
      thisWeek: tributes.filter((t) => new Date(t.createdAt) >= weekAgo).length,
      thisMonth: tributes.filter((t) => new Date(t.createdAt) >= monthAgo)
        .length,
      uniqueObituaries: new Set(
        tributes.map((t) => t.tributeId?._id?.toString()).filter(Boolean)
      ).size,
    };

    return NextResponse.json({
      tributes,
      userMap,
      stats,
    });
  } catch (error) {
    console.error("Admin tributes API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
