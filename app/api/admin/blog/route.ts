import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireRoleUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import BlogPost from "@/models/blog-post";
import User from "@/models/user";

export async function GET(req: Request) {
  try {
    const { user, isAdmin } = await requireRoleUser(await cookies(), ["admin"]);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await getDb();

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");

    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const [posts, users] = await Promise.all([
      BlogPost.find(filter)
        .populate("authorId", "name email")
        .sort({ createdAt: -1 })
        .lean(),
      User.find({}).select("_id name email").lean(),
    ]);

    const userMap = users.reduce((acc: any, user: any) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    const stats = {
      total: await BlogPost.countDocuments(),
      published: await BlogPost.countDocuments({ status: "published" }),
      draft: await BlogPost.countDocuments({ status: "draft" }),
      thisMonth: await BlogPost.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
    };

    const categories = await BlogPost.distinct("category");

    return NextResponse.json({
      posts,
      userMap,
      stats,
      categories,
    });
  } catch (error) {
    console.error("Admin blog API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
