import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import BlogPost from "@/models/blog-post"

export async function GET(req: Request) {
  await getDb()
  const url = new URL(req.url)
  const category = url.searchParams.get("category")
  const filter:any = { published: true }
  if (category) filter.category = category
  const posts = await BlogPost.find(filter).sort({ createdAt: -1 }).limit(20).lean()
  return NextResponse.json({ posts })
}
