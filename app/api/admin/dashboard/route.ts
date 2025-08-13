import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { requireRoleUser } from "@/lib/auth"
import { getDb } from "@/lib/db"
import Tribute from "@/models/tribute"
import User from "@/models/user"
import Service from "@/models/service"
import LegacyOrder from "@/models/legacy-order"
import BlogPost from "@/models/blog-post"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const { user, isAdmin } = await requireRoleUser(cookieStore, ["admin"])

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await getDb()

    // Get date for comparison (7 days ago)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    // Fetch all statistics in parallel
    const [
      totalTributes,
      pendingTributes,
      approvedTributes,
      recentTributes,
      weekOldTributes,
      totalUsers,
      recentUsers,
      weekOldUsers,
      totalServices,
      pendingServices,
      approvedServices,
      recentServices,
      totalOrders,
      pendingOrders,
      completedOrders,
      recentOrders,
      totalBlogPosts,
      publishedBlogPosts,
      draftBlogPosts,
      recentBlogPosts,
      recentActivityTributes,
      recentActivityUsers,
      recentActivityServices,
      recentActivityOrders,
    ] = await Promise.all([
      // Tribute statistics
      Tribute.countDocuments({}),
      Tribute.countDocuments({ status: "pending" }),
      Tribute.countDocuments({ status: "approved" }),
      Tribute.countDocuments({ createdAt: { $gte: weekAgo } }),
      Tribute.countDocuments({
        createdAt: {
          $gte: new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
          $lt: weekAgo,
        },
      }),

      // User statistics
      User.countDocuments({}),
      User.countDocuments({ createdAt: { $gte: weekAgo } }),
      User.countDocuments({
        createdAt: {
          $gte: new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
          $lt: weekAgo,
        },
      }),

      // Service statistics
      Service.countDocuments({}),
      Service.countDocuments({ status: "pending" }),
      Service.countDocuments({ status: "approved" }),
      Service.countDocuments({ createdAt: { $gte: weekAgo } }),

      // Order statistics
      LegacyOrder.countDocuments({}),
      LegacyOrder.countDocuments({ status: "pending" }),
      LegacyOrder.countDocuments({ status: "completed" }),
      LegacyOrder.countDocuments({ createdAt: { $gte: weekAgo } }),

      // Blog statistics
      BlogPost.countDocuments({}),
      BlogPost.countDocuments({ status: "published" }),
      BlogPost.countDocuments({ status: "draft" }),
      BlogPost.countDocuments({ createdAt: { $gte: weekAgo } }),

      // Recent activity
      Tribute.find({ createdAt: { $gte: weekAgo } })
        .populate("userId", "name")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      User.find({ createdAt: { $gte: weekAgo } })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      Service.find({ createdAt: { $gte: weekAgo } })
        .populate("submittedBy", "name email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      LegacyOrder.find({ createdAt: { $gte: weekAgo } })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ])

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? "100" : "0"
      return (((current - previous) / previous) * 100).toFixed(1)
    }

    const tributeGrowth = calculateGrowth(recentTributes, weekOldTributes)
    const userGrowth = calculateGrowth(recentUsers, weekOldUsers)

    const dashboardData = {
      statistics: {
        tributes: {
          total: totalTributes,
          pending: pendingTributes,
          approved: approvedTributes,
          recent: recentTributes,
          growth: tributeGrowth,
        },
        users: {
          total: totalUsers,
          recent: recentUsers,
          growth: userGrowth,
        },
        services: {
          total: totalServices,
          pending: pendingServices,
          approved: approvedServices,
          recent: recentServices,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
          recent: recentOrders,
        },
        blog: {
          total: totalBlogPosts,
          published: publishedBlogPosts,
          draft: draftBlogPosts,
          recent: recentBlogPosts,
        },
      },
      recentActivity: {
        tributes: recentActivityTributes,
        users: recentActivityUsers,
        services: recentActivityServices,
        orders: recentActivityOrders,
      },
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Admin dashboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
