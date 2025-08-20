import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { requireRoleUser } from "@/lib/auth"
import { getDb } from "@/lib/db"
import Tribute from "@/models/tribute"
import User from "@/models/user"

export async function GET(req: Request) {
  try {
    const { user, isAdmin } = await requireRoleUser(await cookies(), ["admin"])
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await getDb()

    const url = new URL(req.url)
    const status = url.searchParams.get("status")
    const search = url.searchParams.get("search")
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = 20
    const skip = (page - 1) * limit

    // Build filter
    const filter: any = {}
    if (status && status !== "all") {
      filter.status = status
    }

    // Add search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { eulogy: { $regex: search, $options: "i" } },
        { biography: { $regex: search, $options: "i" } },
      ]
    }

    console.log("Admin obituaries filter:", filter)

    const [obituaries, totalCount, users] = await Promise.all([
      Tribute.find(filter).populate("userId", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Tribute.countDocuments(filter),
      User.find({}).select("_id name email").lean(),
    ])

    console.log(`Found ${obituaries.length} obituaries for admin`)

    const userMap = users.reduce((acc: any, user: any) => {
      acc[user._id.toString()] = user
      return acc
    }, {})

    // Get comprehensive statistics
    const stats = {
      total: await Tribute.countDocuments(),
      pending: await Tribute.countDocuments({ status: "pending" }),
      approved: await Tribute.countDocuments({ status: "approved" }),
      published: await Tribute.countDocuments({ status: "published" }),
      rejected: await Tribute.countDocuments({ status: "rejected" }),
      draft: await Tribute.countDocuments({ status: "draft" }),
      paid: await Tribute.countDocuments({ paid: true }),
      unpaid: await Tribute.countDocuments({ paid: false }),
    }

    console.log("Admin obituaries stats:", stats)

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      obituaries,
      userMap,
      stats,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Admin obituaries API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
