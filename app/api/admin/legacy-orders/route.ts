import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireRoleUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import LegacyOrder from "@/models/legacy-order";
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

    const filter: any = {};
    if (status) filter.status = status;

    const [orders, users] = await Promise.all([
      LegacyOrder.find(filter)
        .populate("userId", "name email")
        .populate("assignedToUserId", "name email")
        .sort({ createdAt: -1 })
        .lean(),
      User.find({}).select("_id name email role").lean(),
    ]);

    const userMap = users.reduce((acc: any, user: any) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    const stats = {
      total: await LegacyOrder.countDocuments(),
      pending: await LegacyOrder.countDocuments({ status: "pending" }),
      approved: await LegacyOrder.countDocuments({ status: "approved" }),
      assigned: await LegacyOrder.countDocuments({ status: "assigned" }),
      completed: await LegacyOrder.countDocuments({ status: "completed" }),
      designPackages: await LegacyOrder.countDocuments({
        packageType: "design",
      }),
      fullPackages: await LegacyOrder.countDocuments({ packageType: "full" }),
    };

    return NextResponse.json({
      orders,
      userMap,
      stats,
    });
  } catch (error) {
    console.error("Admin legacy orders API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
