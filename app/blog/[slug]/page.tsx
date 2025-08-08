import { getDb } from "@/lib/db";
import BlogPost from "@/models/blog-post";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  await getDb();
  const post = await BlogPost.findOne({
    slug: params.slug,
    published: true,
  }).lean();
  if (!post) return notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <img
          src={
            post.coverImage?.url ||
            "/placeholder.svg?height=260&width=640&query=abstract+soft+cover"
          }
          className="w-full h-52 object-cover rounded-md"
          alt="cover"
        />
        <h1 className="text-3xl font-semibold mt-4">{post.title}</h1>
        <div className="text-xs text-muted-foreground mt-1">
          {post.category}
        </div>
        <article className="prose dark:prose-invert mt-6 whitespace-pre-wrap">
          {post.content}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
