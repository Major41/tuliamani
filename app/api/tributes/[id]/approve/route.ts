import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import Tribute from "@/models/tribute";
import { requireRoleUser } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const { user, isAdmin } = await requireRoleUser(await cookies(), ["admin"]);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await getDb();

    console.log(`Admin ${user.email} approving obituary ${params.id}`);

    const tribute = await Tribute.findByIdAndUpdate(
      params.id,
      {
        status: "published", // Changed from "approved" to "published" to make it immediately visible
        publishedAt: new Date(),
        approvedBy: user._id,
        approvedAt: new Date(),
      },
      { new: true }
    );

    if (!tribute) {
      return NextResponse.json(
        { error: "Obituary not found" },
        { status: 404 }
      );
    }

    console.log(
      `Obituary ${params.id} approved and published by admin ${user.email}`
    );

    return NextResponse.json({
      success: true,
      tribute,
      message: "Obituary approved and published successfully",
    });
  } catch (error) {
    console.error("Error approving obituary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
