import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import Tribute from "@/models/tribute";
import { cookies } from "next/headers";
import { getUserFromCookies, requireRoleUser } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await getDb();
  const tribute = await Tribute.findById(params.id).lean();
  if (!tribute)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ tribute });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await getDb();
    const tribute = await Tribute.findById(params.id);
    if (!tribute)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const me = await getUserFromCookies(await cookies());
    const { isAdmin } = await requireRoleUser(
      await cookies(),
      ["admin"],
      false
    );

    if (!me || (String(tribute.userId) !== String(me._id) && !isAdmin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // Handle all the new fields
    const allowedFields = [
      // Step 1: Personal Details
      "fullName",
      "dateOfBirth",
      "dateOfDeath",
      "epitaph",
      "eulogy",
      "affirmingPhrase",

      // Step 2: Memorial Content
      "mainPortrait",
      "imageGallery",
      "familyGatheringNotes",
      "donationRequests",
      "donationMessage",
      "memorialServices",
      "burialServices",
      "familyTree",
      "acknowledgements",

      // Step 3: Publisher Details
      "publisher",

      // Step 4: Settings
      "allowPublicTributes",
      "mpesaConfirmationCode",
      "paymentYears",
      "publisherAcknowledgement",

      // Legacy fields for backward compatibility
      "name",
      "dob",
      "dod",
      "images",
      "funeralInfo",
      "contributor",
    ];

    allowedFields.forEach((field) => {
      if (field in body) {
        (tribute as any)[field] = body[field];
      }
    });

    // Handle legacy field mapping
    if (body.name && !body.fullName) tribute.fullName = body.name;
    if (body.dob && !body.dateOfBirth) tribute.dateOfBirth = body.dob;
    if (body.dod && !body.dateOfDeath) tribute.dateOfDeath = body.dod;

    // Handle images array for backward compatibility
    if (body.images && Array.isArray(body.images)) {
      const portrait = body.images.find((img: any) => img.type === "portrait");
      const gallery = body.images.filter((img: any) => img.type === "gallery");

      if (portrait) tribute.mainPortrait = portrait;
      if (gallery.length > 0) tribute.imageGallery = gallery;
    }

    await tribute.save();
    return NextResponse.json({ tribute });
  } catch (error) {
    console.error("Error updating tribute:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
