import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import Tribute from "@/models/tribute";
import { cookies } from "next/headers";
import { getUserFromCookies, requireAuthUser } from "@/lib/auth";

// This endpoint handles obituaries (main memorials created by registered users)
export async function GET(req: Request) {
  await getDb();
  const url = new URL(req.url);
  const mine = url.searchParams.get("mine");
  const status = url.searchParams.get("status");
  let filter: any = {};
  const user = await getUserFromCookies(await cookies());
  if (mine && user) filter.userId = user._id;
  if (status) filter.status = status;
  const obituaries = await Tribute.find(filter)
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return NextResponse.json({ obituaries });
}

export async function POST(req: Request) {
  const user = await requireAuthUser(await cookies());
  await getDb();
  const body = await req.json();
  // enforce gallery image limit (max 5 for obituary creation)
  const portrait = (body.images || []).find((i: any) => i.type === "portrait");
  const gallery = (body.images || [])
    .filter((i: any) => i.type !== "portrait")
    .slice(0, 4);
  const created = await Tribute.create({
    ...body,
    images: [...(portrait ? [portrait] : []), ...gallery],
    userId: user._id,
    status: "pending",
    paid: false,
  });
  return NextResponse.json({ obituary: created });
}
