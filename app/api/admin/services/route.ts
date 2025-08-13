import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireRoleUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import Service from "@/models/service";
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
    const category = url.searchParams.get("category");

    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const [services, users] = await Promise.all([
      Service.find(filter)
        .populate("submittedByUserId", "name email")
        .sort({ createdAt: -1 })
        .lean(),
      User.find({}).select("_id name email").lean(),
    ]);

    const userMap = users.reduce((acc: any, user: any) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    const stats = {
      total: await Service.countDocuments(),
      pending: await Service.countDocuments({ status: "pending" }),
      approved: await Service.countDocuments({ status: "approved" }),
      rejected: await Service.countDocuments({ status: "rejected" }),
    };

    const categories = await Service.distinct("category");

    return NextResponse.json({
      services,
      userMap,
      stats,
      categories,
    });
  } catch (error) {
    console.error("Admin services API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
