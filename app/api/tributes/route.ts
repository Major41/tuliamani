import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import Comment from "@/models/comment";
import Tribute from "@/models/tribute";
import User from "@/models/user";
import Notification from "@/models/notification";
import { getUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await getDb();

    const url = new URL(req.url);
    const tributeId = url.searchParams.get("tributeId");

    if (tributeId) {
      // Get tributes for a specific obituary
      const tributes = await Comment.find({
        tributeId,
        type: "tribute",
      })
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({ success: true, tributes });
    } else {
      // Get all tributes for user's obituaries
      const userTributes = await Comment.find({
        tributeId: {
          $in: await Tribute.find({ userId: user._id }).distinct("_id"),
        },
        type: "tribute",
      })
        .populate("tributeId", "fullName mainPortrait")
        .sort({ createdAt: -1 })
        .lean();

      // Transform the data to match the expected format
      const transformedTributes = userTributes.map((tribute) => ({
        ...tribute,
        tributeId: {
          _id: tribute.tributeId._id,
          deceasedName: tribute.tributeId.fullName,
          portraitUrl: tribute.tributeId.mainPortrait?.url || null,
        },
      }));

      return NextResponse.json({
        success: true,
        tributes: transformedTributes,
      });
    }
  } catch (error) {
    console.error("Failed to fetch tributes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tributes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await getDb();

    const { tributeId, name, phone, relationship, message } = await req.json();

    if (!tributeId || !name || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the tribute/obituary to find the owner
    const tribute = await Tribute.findById(tributeId).populate(
      "userId",
      "name email"
    );
    if (!tribute) {
      return NextResponse.json(
        { success: false, error: "Obituary not found" },
        { status: 404 }
      );
    }

    // Create the tribute comment
    const newTribute = await Comment.create({
      tributeId,
      type: "tribute",
      authorName: name,
      authorPhone: phone,
      authorRelationship: relationship,
      content: message,
      createdAt: new Date(),
    });

    // Create notification for obituary owner
    await Notification.create({
      userId: tribute.userId._id,
      type: "tribute_received",
      title: "New Tribute Received",
      message: `${name} left a tribute for ${tribute.fullName}`,
      relatedId: tributeId,
      createdAt: new Date(),
    });

    // Create notification for admin
    const adminUser = await User.findOne({ role: "admin" });
    if (adminUser) {
      await Notification.create({
        userId: adminUser._id,
        type: "new_tribute",
        title: "New Tribute Posted",
        message: `${name} left a tribute for ${tribute.fullName}`,
        relatedId: tributeId,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, tribute: newTribute });
  } catch (error) {
    console.error("Failed to create tribute:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create tribute" },
      { status: 500 }
    );
  }
}
