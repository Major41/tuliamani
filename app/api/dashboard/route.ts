import { type NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { cookies } from "next/headers";
import { getUserFromCookies } from "@/lib/auth";
import Tribute from "@/models/tribute";
import LegacyOrder from "@/models/legacy-order";
import Comment from "@/models/comment";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    await getDb();

    const cookieStore = await cookies();
    const user = await getUserFromCookies(cookieStore);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Dashboard API - User:", user);
    const userId = new ObjectId(user._id);

    // Get current date for recent calculations
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // First, let's check what obituaries exist for this user
    const allUserObituaries = await Tribute.find({ userId: userId }).lean();
    console.log("All user obituaries:", allUserObituaries.length);
    console.log("Sample obituary:", allUserObituaries[0]);

    // Fetch obituaries statistics with proper ObjectId matching
    const obituariesStats = await Tribute.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    console.log("Obituaries stats from aggregation:", obituariesStats);

    // Convert to object for easier access
    const obituaryStatusCounts = obituariesStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    // Calculate totals
    const totalObituaries = obituariesStats.reduce(
      (sum, item) => sum + item.count,
      0
    );
    const publishedObituaries = obituaryStatusCounts.published || 0;
    const pendingObituaries = obituaryStatusCounts.pending || 0;
    const approvedObituaries = obituaryStatusCounts.approved || 0;
    const rejectedObituaries = obituaryStatusCounts.rejected || 0;
    const draftObituaries = obituaryStatusCounts.draft || 0;

    console.log("Calculated obituary stats:", {
      totalObituaries,
      publishedObituaries,
      pendingObituaries,
      approvedObituaries,
      rejectedObituaries,
      draftObituaries,
    });

    // Fetch tributes statistics (comments on user's obituaries)
    const userObituaryIds = allUserObituaries.map((obit) => obit._id);
    console.log("User obituary IDs for tributes:", userObituaryIds);

    const totalTributes = await Comment.countDocuments({
      tributeId: { $in: userObituaryIds },
    });

    const recentTributes = await Comment.countDocuments({
      tributeId: { $in: userObituaryIds },
      createdAt: { $gte: oneWeekAgo },
    });

    console.log("Tributes count:", { totalTributes, recentTributes });

    // Fetch legacy orders statistics
    const totalLegacyOrders = await LegacyOrder.countDocuments({
      userId: userId,
    });
    const completedLegacyOrders = await LegacyOrder.countDocuments({
      userId: userId,
      status: "completed",
    });

    console.log("Legacy orders count:", {
      totalLegacyOrders,
      completedLegacyOrders,
    });

    // Fetch recent obituaries with proper field selection
    const recentObituaries = await Tribute.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select(
        "fullName mainPortrait status createdAt dateOfBirth dateOfDeath epitaph publisher familyTree memorialServices burialServices"
      )
      .lean();

    console.log("Recent obituaries count:", recentObituaries.length);

    // Fetch recent tributes (comments on user's obituaries)
    const recentTributesData = await Comment.find({
      tributeId: { $in: userObituaryIds },
    })
      .populate("tributeId", "fullName mainPortrait")
      .sort({ createdAt: -1 })
      .limit(3)
      .select("authorName authorRelationship content createdAt tributeId")
      .lean();

    console.log("Recent tributes data count:", recentTributesData.length);

    // Fetch recent legacy orders
    const recentLegacyOrders = await LegacyOrder.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("packageType status totalAmount createdAt")
      .lean();

    const stats = {
      totalObituaries,
      publishedObituaries,
      pendingObituaries,
      approvedObituaries,
      rejectedObituaries,
      draftObituaries,
      totalTributes,
      recentTributes,
      totalLegacyOrders,
      completedLegacyOrders,
    };

    console.log("Final stats being returned:", stats);

    return NextResponse.json({
      success: true,
      stats,
      recentObituaries,
      recentTributes: recentTributesData,
      recentLegacyOrders,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
