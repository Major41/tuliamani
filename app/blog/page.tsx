import { getDb } from "@/lib/db";
import BlogPost from "@/models/blog-post";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  await getDb();
  const filter: any = { published: true };
  if (searchParams.category) filter.category = searchParams.category;
  const posts = await BlogPost.find(filter)
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <p className="text-sm text-muted-foreground">
          Grief, Legacy, Compassion, and more.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {posts.map((p: any) => (
            <Link
              key={p._id}
              href={`/blog/${p.slug}`}
              className="rounded-lg border p-4 hover:shadow-sm transition"
            >
              <img
                src={
                  p.coverImage?.url ||
                  "/placeholder.svg?height=160&width=320&query=abstract+soft+cover"
                }
                className="w-full h-40 object-cover rounded-md"
                alt="cover"
              />
              <div className="mt-2 text-xs text-muted-foreground">
                {p.category}
              </div>
              <div className="mt-1 font-semibold">{p.title}</div>
            </Link>
          ))}
          {posts.length === 0 && (
            <div className="text-sm text-muted-foreground">No posts yet.</div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
