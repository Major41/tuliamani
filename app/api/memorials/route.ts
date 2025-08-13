import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import Tribute from "@/models/tribute";

export async function GET(req: Request) {
  try {
    await getDb();

    const url = new URL(req.url);
    const page = Number.parseInt(url.searchParams.get("page") || "1");
    const limit = Number.parseInt(url.searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Only show approved or published tributes to public
    const [tributes, totalCount] = await Promise.all([
      Tribute.find({
        status: { $in: ["approved", "published"] },
      })
        .populate("userId", "name email")
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Tribute.countDocuments({
        status: { $in: ["approved", "published"] },
      }),
    ]);

    return NextResponse.json({
      success: true,
      tributes,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Failed to fetch memorials:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch memorials" },
      { status: 500 }
    );
  }
}
