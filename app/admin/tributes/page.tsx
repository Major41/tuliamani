"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Heart,
  MessageCircle,
  Users,
  Calendar,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface TributesData {
  tributes: any[];
  userMap: Record<string, any>;
  stats: {
    total: number;
    thisWeek: number;
    thisMonth: number;
    uniqueObituaries: number;
  };
}

export default function AdminTributesPage() {
  const [data, setData] = useState<TributesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/tributes");
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
                <BreadcrumbPage>Tributes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tributes Management</h1>
              <p className="text-muted-foreground">
                View all tribute messages across the platform
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tributes
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.total}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.thisWeek}</div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month
                </CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.thisMonth}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Obituaries
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.stats.uniqueObituaries}
                </div>
                <p className="text-xs text-muted-foreground">With tributes</p>
              </CardContent>
            </Card>
          </div>

          {/* Tributes List */}
          <div className="space-y-4">
            {data.tributes.map((tribute: any) => {
              const obituary = tribute.tributeId;
              const portrait = obituary?.images?.find(
                (i: any) => i.type === "portrait"
              );

              return (
                <Card
                  key={tribute._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Obituary Portrait */}
                      <div className="flex-shrink-0">
                        {portrait?.url ? (
                          <img
                            src={portrait.url || "/placeholder.svg"}
                            alt={obituary?.name || "Portrait"}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                            <Users className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              Tribute for {obituary?.name || "Unknown"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              By {tribute.authorName} •{" "}
                              {new Date(tribute.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {obituary && (
                            <Link href={`/obituaries/${tribute.tributeId}`}>
                              <Badge
                                variant="outline"
                                className="cursor-pointer hover:bg-muted"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Obituary
                              </Badge>
                            </Link>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Author:</span>{" "}
                            {tribute.authorName}
                          </div>
                          {tribute.authorEmail && (
                            <div>
                              <span className="font-medium">Email:</span>{" "}
                              {tribute.authorEmail}
                            </div>
                          )}
                          {tribute.authorPhone && (
                            <div>
                              <span className="font-medium">Phone:</span>{" "}
                              {tribute.authorPhone}
                            </div>
                          )}
                          {tribute.relationship && (
                            <div>
                              <span className="font-medium">Relationship:</span>{" "}
                              {tribute.relationship}
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="font-medium text-sm">Message:</span>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap line-clamp-4">
                            {tribute.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {data.tributes.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Heart className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No tributes found
                  </h3>
                  <p className="text-muted-foreground text-center">
                    No tribute messages have been submitted yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
