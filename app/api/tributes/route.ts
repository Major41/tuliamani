import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import Comment from "@/models/comment";
import Tribute from "@/models/tribute";
import Notification from "@/models/notification";

export async function GET(request: Request) {
  try {
    await getDb();

    const { searchParams } = new URL(request.url);
    const obituaryId = searchParams.get("obituaryId");
    const userId = searchParams.get("userId");

    if (obituaryId) {
      // Get tributes for a specific obituary
      const tributes = await Comment.find({
        tributeId: obituaryId,
        type: "tribute",
      })
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        tributes,
      });
    }

    if (userId) {
      // Get all tributes for obituaries owned by this user
      const userObituaries = await Tribute.find({ userId }).select(
        "_id name images dob dod"
      );
      const obituaryIds = userObituaries.map((o) => o._id);

      const tributes = await Comment.find({
        tributeId: { $in: obituaryIds },
        type: "tribute",
      })
        .populate("tributeId", "name _id")
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        tributes,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Missing required parameters",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to fetch tributes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tributes",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await getDb();

    const body = await request.json();
    const { obituaryId, name, phone, relationship, message } = body;

    if (!obituaryId || !name || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Get the obituary to find the owner
    const obituary = await Tribute.findById(obituaryId).populate("userId");
    if (!obituary) {
      return NextResponse.json(
        {
          success: false,
          error: "Obituary not found",
        },
        { status: 404 }
      );
    }

    // Check if obituary allows public tributes
    if (!obituary.allowPublicTributes) {
      return NextResponse.json(
        {
          success: false,
          error: "Tributes are not allowed for this obituary",
        },
        { status: 403 }
      );
    }

    // Create the tribute comment
    const tribute = await Comment.create({
      tributeId: obituaryId,
      name,
      authName: name,
      phone: phone || "",
      relationship: relationship || "",
      message,
      type: "tribute",
      approved: true, // Auto-approve public tributes
    });

    // Create notification for obituary owner
    if (obituary.userId) {
      await Notification.create({
        userId: obituary.userId._id,
        type: "tribute",
        title: "New Tribute Received",
        message: `${name} left a tribute for ${obituary.name}`,
        data: {
          obituaryId: obituaryId,
          tributeId: tribute._id,
          tributorName: name,
        },
      });
    }

    // Create notification for admin
    await Notification.create({
      type: "admin_tribute",
      title: "New Public Tribute",
      message: `${name} left a tribute for ${obituary.name}`,
      data: {
        obituaryId: obituaryId,
        tributeId: tribute._id,
        tributorName: name,
        obituaryName: obituary.name,
      },
    });

    return NextResponse.json({
      success: true,
      tribute,
    });
  } catch (error) {
    console.error("Failed to create tribute:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create tribute",
      },
      { status: 500 }
    );
  }
}
