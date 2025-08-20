import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import Tribute from "@/models/tribute";
import { requireRoleUser } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user, isAdmin } = await requireRoleUser(await cookies(), ["admin"]);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { reason } = await req.json();

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    await getDb();

    console.log(
      `Admin ${user.email} rejecting obituary ${params.id} with reason: ${reason}`
    );

    const tribute = await Tribute.findByIdAndUpdate(
      params.id,
      {
        status: "rejected",
        rejectionReason: reason.trim(),
        rejectedAt: new Date(),
        rejectedBy: user._id,
      },
      { new: true }
    );

    if (!tribute) {
      return NextResponse.json(
        { error: "Obituary not found" },
        { status: 404 }
      );
    }

    console.log(`Obituary ${params.id} rejected by admin ${user.email}`);

    return NextResponse.json({
      success: true,
      tribute,
      message: "Obituary rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting obituary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
