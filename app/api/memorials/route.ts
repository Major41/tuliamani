import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import Tribute from "@/models/tribute"

export async function GET(req: Request) {
  try {
    await getDb()

    const url = new URL(req.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "12")
    const search = url.searchParams.get("search")
    const skip = (page - 1) * limit

    console.log(`Fetching memorials - page: ${page}, limit: ${limit}`)

    // Build filter - only show published obituaries
    const filter: any = {
      status: "published",
    }

    // Add search functionality
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { biography: { $regex: search, $options: "i" } },
        { epitaph: { $regex: search, $options: "i" } },
      ]
    }

    console.log("Memorial site filter:", JSON.stringify(filter, null, 2))

    // Fetch obituaries without user population to avoid schema error
    const [obituaries, totalCount] = await Promise.all([
      Tribute.find(filter)
        .select({
          fullName: 1,
          dateOfBirth: 1,
          dateOfDeath: 1,
          placeOfBirth: 1,
          placeOfDeath: 1,
          biography: 1,
          epitaph: 1,
          mainPortrait: 1,
          imageGallery: 1,
          familyTree: 1,
          memorialServices: 1,
          burialServices: 1,
          createdAt: 1,
          updatedAt: 1,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Tribute.countDocuments(filter),
    ])

    console.log(`Found ${obituaries.length} published obituaries`)

    // Transform data for frontend
    const transformedObituaries = obituaries.map((obituary: any) => ({
      _id: obituary._id,
      fullName: obituary.fullName,
      dateOfBirth: obituary.dateOfBirth,
      dateOfDeath: obituary.dateOfDeath,
      placeOfBirth: obituary.placeOfBirth,
      placeOfDeath: obituary.placeOfDeath,
      biography: obituary.biography,
      epitaph: obituary.epitaph,
      portraitUrl: obituary.mainPortrait?.url || null,
      galleryImages: obituary.imageGallery || [],
      familyTree: obituary.familyTree || [],
      memorialServices: obituary.memorialServices || [],
      burialServices: obituary.burialServices || [],
      createdAt: obituary.createdAt,
      updatedAt: obituary.updatedAt,
    }))

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      obituaries: transformedObituaries,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Memorials API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch memorials",
        obituaries: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          hasNext: false,
          hasPrev: false,
        },
      },
      { status: 500 },
    )
  }
}
