import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireRoleUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import Tribute from "@/models/tribute";
import User from "@/models/user";

export async function GET(req: Request) {
  try {
    const { user, isAdmin } = await requireRoleUser(await cookies(), ["admin"]);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await getDb();

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const page = Number.parseInt(url.searchParams.get("page") || "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const [obituaries, totalCount, users] = await Promise.all([
      Tribute.find(filter)
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Tribute.countDocuments(filter),
      User.find({}).select("_id name email").lean(),
    ]);

    const userMap = users.reduce((acc: any, user: any) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    const stats = {
      total: await Tribute.countDocuments(),
      pending: await Tribute.countDocuments({ status: "pending" }),
      published: await Tribute.countDocuments({ status: "approved" }),
      draft: await Tribute.countDocuments({ status: "draft" }),
      paid: await Tribute.countDocuments({ paid: true }),
      unpaid: await Tribute.countDocuments({ paid: false }),
    };

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      obituaries,
      userMap,
      stats,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Admin obituaries API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
