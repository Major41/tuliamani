import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import Tribute from "@/models/tribute";
import { cookies } from "next/headers";
import { getUserFromCookies, requireAuthUser } from "@/lib/auth";

export async function GET(req: Request) {
  await getDb();
  const url = new URL(req.url);
  const mine = url.searchParams.get("mine");
  const status = url.searchParams.get("status");
  const filter: any = {};
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

  try {
    // Validate required fields
    if (
      !body.fullName ||
      !body.dateOfBirth ||
      !body.dateOfDeath ||
      !body.eulogy
    ) {
      return NextResponse.json(
        { error: "Missing required personal details" },
        { status: 400 }
      );
    }

    if (!body.mainPortrait) {
      return NextResponse.json(
        { error: "Main portrait is required" },
        { status: 400 }
      );
    }

    if (
      !body.publisher ||
      !body.publisher.name ||
      !body.publisher.phone ||
      !body.publisher.email
    ) {
      return NextResponse.json(
        { error: "Missing required publisher details" },
        { status: 400 }
      );
    }

    if (!body.mpesaConfirmationCode) {
      return NextResponse.json(
        { error: "M-Pesa confirmation code is required" },
        { status: 400 }
      );
    }

    if (!body.publisherAcknowledgement) {
      return NextResponse.json(
        { error: "Publisher acknowledgement is required" },
        { status: 400 }
      );
    }

    // Limit gallery images to 5
    const imageGallery = (body.imageGallery || []).slice(0, 5);

    const created = await Tribute.create({
      userId: user._id,

      // Step 1: Personal Details
      fullName: body.fullName,
      dateOfBirth: body.dateOfBirth,
      dateOfDeath: body.dateOfDeath,
      epitaph: body.epitaph || "",
      eulogy: body.eulogy,
      affirmingPhrase: body.affirmingPhrase || "",

      // Step 2: Memorial Content & Service Details
      mainPortrait: body.mainPortrait,
      imageGallery,
      familyGatheringNotes: body.familyGatheringNotes || "",
      donationRequests: body.donationRequests || [],
      donationMessage: body.donationMessage || "",
      memorialServices: body.memorialServices || [],
      burialServices: body.burialServices || [],
      familyTree: body.familyTree || [],
      acknowledgements: body.acknowledgements || "",

      // Step 3: Publisher Details
      publisher: {
        name: body.publisher.name,
        relationship: body.publisher.relationship,
        phone: body.publisher.phone,
        alternatePhone: body.publisher.alternatePhone || "",
        email: body.publisher.email,
        preferredContact: body.publisher.preferredContact || "sms_call",
      },

      // Step 4: Payment & Publishing
      mpesaConfirmationCode: body.mpesaConfirmationCode,
      allowPublicTributes: body.allowPublicTributes !== false,
      publisherAcknowledgement: body.publisherAcknowledgement,
      paymentYears: body.paymentYears || 1,

      // System fields
      status: "pending",
      paid: false,
    });

    return NextResponse.json({ obituary: created });
  } catch (error: any) {
    console.error("Error creating obituary:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create obituary" },
      { status: 500 }
    );
  }
}
