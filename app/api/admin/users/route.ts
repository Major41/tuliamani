import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireRoleUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import User from "@/models/user";

export async function GET(req: Request) {
  try {
    const { user, isAdmin } = await requireRoleUser(await cookies(), ["admin"]);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await getDb();

    const [users, userStats] = await Promise.all([
      User.find({}).sort({ createdAt: -1 }).lean(),
      User.aggregate([
        {
          $lookup: {
            from: "tributes",
            localField: "_id",
            foreignField: "userId",
            as: "obituaries",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            role: 1,
            createdAt: 1,
            obituaryCount: { $size: "$obituaries" },
          },
        },
      ]),
    ]);

    const userStatsMap = userStats.reduce((acc: any, stat: any) => {
      acc[stat._id.toString()] = stat;
      return acc;
    }, {});

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats = {
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      regularUsers: users.filter((u) => u.role === "user").length,
      thisMonth: users.filter((u) => {
        const userDate = new Date(u.createdAt);
        return (
          userDate.getMonth() === now.getMonth() &&
          userDate.getFullYear() === now.getFullYear()
        );
      }).length,
      recentUsers: users.filter((u) => new Date(u.createdAt) >= thirtyDaysAgo)
        .length,
    };

    const recentUsers = users
      .filter((u) => new Date(u.createdAt) >= thirtyDaysAgo)
      .slice(0, 10);

    return NextResponse.json({
      users,
      userStatsMap,
      stats,
      recentUsers,
    });
  } catch (error) {
    console.error("Admin users API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
