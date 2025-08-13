"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FileText, Eye, Edit, Tag, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface BlogData {
  posts: any[];
  userMap: Record<string, any>;
  stats: {
    total: number;
    published: number;
    draft: number;
    thisMonth: number;
  };
  categories: string[];
}

export default function AdminBlogPage() {
  const [data, setData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  useEffect(() => {
    fetchData();
  }, [status, category]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (category) params.set("category", category);

      const response = await fetch(`/api/admin/blog?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const defaultCategories = [
    "grief",
    "memorial",
    "support",
    "guidance",
    "stories",
    "resources",
  ];
  const categories =
    data.categories.length > 0 ? data.categories : defaultCategories;

  return (
    <SidebarProvider>
      <AppSidebar
        user={{ name: "Admin", email: "admin@tuliamani.com", role: "admin" }}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
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
              <h1 className="text-3xl font-bold">Blog Management</h1>
              <p className="text-muted-foreground">
                Manage blog posts and content
              </p>
            </div>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Posts
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.total}</div>
                <p className="text-xs text-muted-foreground">All blog posts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.published}</div>
                <p className="text-xs text-muted-foreground">Live posts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.draft}</div>
                <p className="text-xs text-muted-foreground">Unpublished</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Categories
                </CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories.length}</div>
                <p className="text-xs text-muted-foreground">Content types</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Link href="/admin/blog">
                      <Button
                        variant={!status ? "default" : "outline"}
                        size="sm"
                      >
                        All ({data.stats.total})
                      </Button>
                    </Link>
                    <Link href="/admin/blog?status=published">
                      <Button
                        variant={status === "published" ? "default" : "outline"}
                        size="sm"
                      >
                        Published ({data.stats.published})
                      </Button>
                    </Link>
                    <Link href="/admin/blog?status=draft">
                      <Button
                        variant={status === "draft" ? "default" : "outline"}
                        size="sm"
                      >
                        Draft ({data.stats.draft})
                      </Button>
                    </Link>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Link href="/admin/blog">
                      <Button
                        variant={!category ? "default" : "outline"}
                        size="sm"
                      >
                        All Categories
                      </Button>
                    </Link>
                    {categories.map((cat) => (
                      <Link key={cat} href={`/admin/blog?category=${cat}`}>
                        <Button
                          variant={category === cat ? "default" : "outline"}
                          size="sm"
                          className="capitalize"
                        >
                          {cat}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            {data.posts.map((post: any) => {
              const author =
                data.userMap[post.authorId?.toString()] || post.authorId;

              return (
                <Card
                  key={post._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Cover Image */}
                      <div className="flex-shrink-0">
                        {post.coverImage?.url ? (
                          <img
                            src={post.coverImage.url || "/placeholder.svg"}
                            alt={post.title}
                            className="w-24 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-24 h-16 rounded-lg bg-muted flex items-center justify-center">
                            <FileText className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg line-clamp-1">
                              {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {post.category} •{" "}
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <StatusBadge status={post.status} />
                        </div>

                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-medium">Author:</span>{" "}
                            {author?.name || "Unknown"} (
                            {author?.email || "N/A"})
                            <br />
                            <span className="text-muted-foreground">
                              {post.publishedAt
                                ? `Published ${new Date(
                                    post.publishedAt
                                  ).toLocaleDateString()}`
                                : "Not published"}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Link href={`/blog/${post.slug}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {data.posts.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No blog posts found
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {status || category
                      ? "No posts match the current filters."
                      : "No blog posts have been created yet."}
                  </p>
                  <Button className="mt-4">
                    <Edit className="w-4 h-4 mr-2" />
                    Create First Post
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
