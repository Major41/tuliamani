import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import Tribute from "@/models/tribute";
import { requireRoleUser } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { isAdmin } = await requireRoleUser(await cookies(), ["admin"]);
  if (!isAdmin)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await getDb();
  const tribute = await Tribute.findByIdAndUpdate(
    params.id,
    {
      status: "rejected",
      rejectedAt: new Date(),
    },
    { new: true }
  );

  if (!tribute)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ tribute });
}
