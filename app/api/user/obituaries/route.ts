import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { getUserFromCookies } from "@/lib/auth";
import Tribute from "@/models/tribute";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const user = await getUserFromCookies(cookieStore);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await getDb();

    const obituaries = await Tribute.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ obituaries });
  } catch (error) {
    console.error("Error fetching user obituaries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
