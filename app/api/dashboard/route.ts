import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromCookies } from "@/lib/auth";
import { getDb } from "@/lib/db";
import Tribute from "@/models/tribute";
import Comment from "@/models/comment";
import LegacyOrder from "@/models/legacy-order";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const user = await getUserFromCookies(cookieStore);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await getDb();

    // Get user's obituaries
    const obituaries = await Tribute.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Get tributes received on user's obituaries
    const obituaryIds = obituaries.map((o) => o._id);
    const tributesReceived = await Comment.find({
      tributeId: { $in: obituaryIds },
      type: "tribute",
    })
      .populate("tributeId", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Get user's legacy orders
    const legacyOrders = await LegacyOrder.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate statistics
    const stats = {
      totalObituaries: obituaries.length,
      publishedObituaries: obituaries.filter((o) => o.status === "published")
        .length,
      approvedObituaries: obituaries.filter((o) => o.status === "approved")
        .length,
      memorializedObituaries: obituaries.filter(
        (o) => o.status === "memorialized"
      ).length,
      pendingObituaries: obituaries.filter((o) => o.status === "pending")
        .length,
      rejectedObituaries: obituaries.filter((o) => o.status === "rejected")
        .length,
      totalTributesReceived: tributesReceived.length,
      legacyOrders: legacyOrders.length,
      completedLegacyOrders: legacyOrders.filter(
        (o) => o.status === "completed"
      ).length,
    };

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentTributes = tributesReceived.filter(
      (t) => new Date(t.createdAt) > thirtyDaysAgo
    );

    return NextResponse.json({
      success: true,
      data: {
        obituaries,
        tributesReceived,
        legacyOrders,
        stats,
        recentTributes,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
