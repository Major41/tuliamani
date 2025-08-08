import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import BlogPost from "@/models/blog-post"

export async function GET(_: Request, { params }: { params: { slug: string }}) {
  await getDb()
  const post = await BlogPost.findOne({ slug: params.slug, published: true }).lean()
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ post })
}
