import { cookies } from "next/headers";
import { requireAuthUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import Tribute from "@/models/tribute";
import Comment from "@/models/comment";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { MessageSquare, Heart, Calendar, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function UserTributesPage() {
  const cookieStore = await cookies();
  const user = await requireAuthUser(cookieStore);
  await getDb();

  // Get all obituaries created by this user
  const userObituaries = await Tribute.find({ userId: user._id })
    .select("_id name")
    .lean();
  const obituaryIds = userObituaries.map((o) => o._id);

  // Get all tributes for these obituaries
  const tributes = await Comment.find({ tributeId: { $in: obituaryIds } })
    .populate("tributeId", "name images")
    .sort({ createdAt: -1 })
    .lean();

  // Group tributes by obituary
  const tributesByObituary = tributes.reduce((acc: any, tribute: any) => {
    const obituaryId = tribute.tributeId._id.toString();
    if (!acc[obituaryId]) {
      acc[obituaryId] = {
        obituary: tribute.tributeId,
        tributes: [],
      };
    }
    acc[obituaryId].tributes.push(tribute);
    return acc;
  }, {});

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
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
                <BreadcrumbPage>Tributes Received</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tributes Received</h1>
              <p className="text-muted-foreground">
                Condolence messages and tributes from friends and family
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-3">
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
                  {Object.keys(tributesByObituary).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    tributes.filter((t) => {
                      const tributeDate = new Date(t.createdAt);
                      const now = new Date();
                      return (
                        tributeDate.getMonth() === now.getMonth() &&
                        tributeDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tributes by Obituary */}
          {Object.keys(tributesByObituary).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No tributes received yet
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  When people leave condolence messages on your obituaries, they
                  will appear here.
                </p>
                <Link href="/dashboard/obituaries">
                  <Button>View My Obituaries</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.values(tributesByObituary).map((group: any) => (
                <Card key={group.obituary._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            group.obituary.images?.find(
                              (i: any) => i.type === "portrait"
                            )?.url ||
                            "/placeholder.svg?height=60&width=60&query=portrait"
                          }
                          alt="Portrait"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <CardTitle className="text-lg">
                            {group.obituary.name}
                          </CardTitle>
                          <CardDescription>
                            {group.tributes.length} tribute
                            {group.tributes.length !== 1 ? "s" : ""}
                          </CardDescription>
                        </div>
                      </div>
                      <Link href={`/obituaries/${group.obituary._id}`}>
                        <Button variant="outline" size="sm">
                          View Obituary
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {group.tributes.map((tribute: any) => (
                        <div
                          key={tribute._id}
                          className="border rounded-lg p-4 bg-muted/30"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium text-sm">
                                  {tribute.authorName}
                                </div>
                                {tribute.authorEmail && (
                                  <div className="text-xs text-muted-foreground">
                                    {tribute.authorEmail}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(tribute.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {tribute.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
