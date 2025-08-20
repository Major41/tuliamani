"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MessageSquare, User, Calendar, Heart, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Tribute {
  _id: string;
  authorName: string;
  authorPhone?: string;
  authorRelationship?: string;
  content: string;
  createdAt: string;
  tributeId: {
    _id: string;
    deceasedName: string;
    portraitUrl?: string;
  };
}

interface TributesData {
  success: boolean;
  tributes: Tribute[];
}

export default function TributesPage() {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTributes();
  }, []);

  const fetchTributes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tributes");
      const data: TributesData = await response.json();

      if (data.success) {
        setTributes(data.tributes);
      } else {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        setError("Failed to load tributes");
      }
    } catch (error) {
      console.error("Failed to fetch tributes:", error);
      setError("Failed to load tributes");
    } finally {
      setLoading(false);
    }
  };

  // Group tributes by obituary
  const groupedTributes = tributes.reduce((acc, tribute) => {
    const obituaryId = tribute.tributeId._id;
    if (!acc[obituaryId]) {
      acc[obituaryId] = {
        obituary: tribute.tributeId,
        tributes: [],
      };
    }
    acc[obituaryId].tributes.push(tribute);
    return acc;
  }, {} as Record<string, { obituary: any; tributes: Tribute[] }>);

  if (loading) {
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
                <BreadcrumbPage>Tributes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading tributes...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
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
                <BreadcrumbPage>Tributes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-4">
              <Button onClick={fetchTributes}>Try Again</Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </div>
        </main>
      </>
    );
  }

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
              <BreadcrumbPage>Tributes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tributes Received</h1>
          <p className="text-muted-foreground">
            Messages of love and remembrance from family and friends
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tributes
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tributes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Obituaries with Tributes
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(groupedTributes).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  tributes.filter(
                    (t) =>
                      new Date(t.createdAt).getMonth() ===
                        new Date().getMonth() &&
                      new Date(t.createdAt).getFullYear() ===
                        new Date().getFullYear()
                  ).length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {Object.keys(groupedTributes).length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Tributes Yet</h3>
              <p className="text-muted-foreground mb-6">
                Tributes will appear here when people leave messages on your
                obituaries.
              </p>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="/obituaries/new">Create an Obituary</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTributes).map(
              ([obituaryId, { obituary, tributes: obituaryTributes }]) => (
                <Card key={obituaryId}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {obituary.portraitUrl ? (
                        <img
                          src={obituary.portraitUrl || "/placeholder.svg"}
                          alt={obituary.deceasedName}
                          className="w-16 h-16 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}

                      <div className="flex-1">
                        <CardTitle className="text-xl">
                          {obituary.deceasedName}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          {obituaryTributes.length} tribute
                          {obituaryTributes.length !== 1 ? "s" : ""}
                        </p>
                      </div>

                      <Button asChild variant="outline">
                        <Link href={`/obituaries/${obituaryId}`}>
                          View Obituary
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {obituaryTributes.map((tribute) => (
                        <div
                          key={tribute._id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {tribute.authorName}
                              </span>
                              {tribute.authorRelationship && (
                                <Badge variant="secondary" className="text-xs">
                                  {tribute.authorRelationship}
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(tribute.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {tribute.authorPhone && (
                            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{tribute.authorPhone}</span>
                            </div>
                          )}

                          <p className="text-sm leading-relaxed">
                            {tribute.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        )}
      </main>
    </>
  );
}
