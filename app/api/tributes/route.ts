import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import Comment from "@/models/comment";
import Tribute from "@/models/tribute";

// This endpoint now handles tribute messages (condolences) from anyone
export async function POST(req: Request) {
  await getDb();

  try {
    const body = await req.json();
    const { obituaryId, message, authorName, authorEmail } = body;

    if (!obituaryId || !message || !authorName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const obituary = await Tribute.findById(obituaryId);
    if (!obituary) {
      return NextResponse.json(
        { error: "Obituary not found" },
        { status: 404 }
      );
    }

    if (!obituary.allowPublicTributes || obituary.status === "memorialized") {
      return NextResponse.json(
        { error: "Tributes not allowed for this obituary" },
        { status: 403 }
      );
    }

    const tribute = await Comment.create({
      tributeId: obituaryId,
      message: message.trim(),
      authorName: authorName.trim(),
      authorEmail: authorEmail?.trim() || undefined,
    });

    return NextResponse.json({ tribute, success: true });
  } catch (error) {
    console.error("Error creating tribute:", error);
    return NextResponse.json(
      { error: "Failed to create tribute" },
      { status: 500 }
    );
  }
}

// Get tributes for a specific obituary or user
export async function GET(req: Request) {
  await getDb();
  const url = new URL(req.url);
  const obituaryId = url.searchParams.get("obituaryId");
  const userId = url.searchParams.get("userId");

  let filter: any = {};

  if (obituaryId) {
    filter.tributeId = obituaryId;
  } else if (userId) {
    // Get all tributes for obituaries created by this user
    const userObituaries = await Tribute.find({ userId }).select("_id");
    const obituaryIds = userObituaries.map((o) => o._id);
    filter.tributeId = { $in: obituaryIds };
  }

  const tributes = await Comment.find(filter)
    .sort({ createdAt: -1 })
    .populate("tributeId", "name")
    .limit(50)
    .lean();

  return NextResponse.json({ tributes });
}
