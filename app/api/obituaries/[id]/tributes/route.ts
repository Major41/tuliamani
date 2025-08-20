import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import Comment from "@/models/comment"
import Tribute from "@/models/tribute"

// GET - Fetch tributes for a specific obituary
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await getDb()

    const obituaryId = params.id
    console.log("Fetching tributes for obituary:", obituaryId)

    // Verify obituary exists
    const obituary = await Tribute.findById(obituaryId)
    if (!obituary) {
      console.log("Obituary not found:", obituaryId)
      return NextResponse.json({ error: "Obituary not found" }, { status: 404 })
    }

    // Fetch approved tributes/comments for this obituary
    const tributes = await Comment.find({
      tributeId: obituaryId,
      status: "approved",
    })
      .sort({ createdAt: -1 })
      .lean()

    console.log(`Found ${tributes.length} approved tributes for obituary ${obituaryId}`)

    // Transform data for frontend
    const transformedTributes = tributes.map((tribute: any) => ({
      _id: tribute._id,
      authorName: tribute.authorName,
      authorEmail: tribute.authorEmail,
      relationship: tribute.authorRelationship,
      message: tribute.content,
      createdAt: tribute.createdAt,
      status: tribute.status,
    }))

    return NextResponse.json({
      success: true,
      tributes: transformedTributes,
    })
  } catch (error) {
    console.error("Failed to fetch tributes:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        tributes: [],
      },
      { status: 500 },
    )
  }
}

// POST - Submit a new tribute for an obituary
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await getDb()

    const obituaryId = params.id
    const { authorName, authorEmail, relationship, message } = await req.json()

    console.log("Submitting tribute for obituary:", obituaryId)
    console.log("Tribute data:", { authorName, authorEmail, relationship, message: message?.substring(0, 50) + "..." })

    // Validate required fields
    if (!authorName?.trim() || !message?.trim()) {
      console.log("Missing required fields")
      return NextResponse.json(
        {
          success: false,
          error: "Name and message are required",
        },
        { status: 400 },
      )
    }

    // Verify obituary exists
    const obituary = await Tribute.findById(obituaryId)
    if (!obituary) {
      console.log("Obituary not found for tribute submission:", obituaryId)
      return NextResponse.json(
        {
          success: false,
          error: "Obituary not found",
        },
        { status: 404 },
      )
    }

    console.log("Obituary found:", obituary.fullName)

    // Create new tribute/comment
    const newTribute = new Comment({
      tributeId: obituaryId,
      authorName: authorName.trim(),
      authorEmail: authorEmail?.trim() || undefined,
      authorRelationship: relationship?.trim() || undefined,
      content: message.trim(),
      status: "pending", // Requires approval
      createdAt: new Date(),
    })

    const savedTribute = await newTribute.save()
    console.log("Tribute submitted successfully:", savedTribute._id)

    return NextResponse.json({
      success: true,
      message: "Tribute submitted successfully. It will be reviewed before being published.",
      tributeId: savedTribute._id,
    })
  } catch (error) {
    console.error("Failed to submit tribute:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit tribute. Please try again.",
      },
      { status: 500 },
    )
  }
}
