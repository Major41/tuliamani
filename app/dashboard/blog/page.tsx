import { cookies } from "next/headers";
import { requireAuthUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import BlogPost from "@/models/blog-post";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FileText, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function UserBlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const cookieStore = await cookies();
  const user = await requireAuthUser(cookieStore);
  await getDb();

  const filter: any = { published: true };
  if (searchParams.category) filter.category = searchParams.category;
  const posts = await BlogPost.find(filter)
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  // Get unique categories
  const allPosts = await BlogPost.find({ published: true })
    .select("category")
    .lean();
  const categories = [
    ...new Set(allPosts.map((p) => p.category).filter(Boolean)),
  ];

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Blog</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Blog & Resources</h1>
            <p className="text-muted-foreground">
              Guidance, support, and insights on grief, legacy, and remembrance
            </p>
          </div>
          <Link href="/blog" target="_blank">
            <Button variant="outline">
              <ArrowRight className="w-4 h-4 mr-2" />
              Visit Public Blog
            </Button>
          </Link>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Browse by Topic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Link href="/dashboard/blog">
                  <Button
                    variant={!searchParams.category ? "default" : "outline"}
                    size="sm"
                  >
                    All Posts
                  </Button>
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/dashboard/blog?category=${encodeURIComponent(
                      category
                    )}`}
                  >
                    <Button
                      variant={
                        searchParams.category === category
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                    >
                      {category}
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Featured/Recent Posts */}
        {posts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchParams.category
                  ? `No posts found in "${searchParams.category}"`
                  : "No blog posts available"}
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {searchParams.category
                  ? `There are currently no posts in this category. Try browsing other topics.`
                  : "Blog posts with guidance and support will appear here."}
              </p>
              {searchParams.category && (
                <Link href="/dashboard/blog">
                  <Button>View All Posts</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <Card
                key={post._id}
                className="hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={
                      post.coverImage?.url ||
                      "/placeholder.svg?height=200&width=350&query=blog+cover+abstract"
                    }
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {post.category && (
                    <div className="absolute top-3 left-3">
                      <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {post.category}
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      {post.author && (
                        <>
                          <span>•</span>
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </>
                      )}
                    </div>

                    <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.content.substring(0, 150)}...
                    </p>

                    <div className="pt-2">
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                        >
                          Read More
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Helpful Resources Card */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Helpful Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Grief Support</h4>
                <p className="text-muted-foreground">
                  Articles and guides to help you navigate the grieving process
                  with compassion and understanding.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Memorial Planning</h4>
                <p className="text-muted-foreground">
                  Tips and ideas for creating meaningful memorials and
                  preserving precious memories.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Legacy Preservation</h4>
                <p className="text-muted-foreground">
                  Learn how to document and share life stories for future
                  generations.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Community Support</h4>
                <p className="text-muted-foreground">
                  Connect with others and find comfort in shared experiences and
                  memories.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t">
              <Link href="/blog" target="_blank">
                <Button>
                  Explore All Resources
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
