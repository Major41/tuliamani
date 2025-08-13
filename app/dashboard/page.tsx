"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { AppSidebar } from "@/components/app-sidebar";
import { ObituaryViewModal } from "@/components/obituary-view-modal";
import { ObituaryEditModal } from "@/components/obituary-edit-modal";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Heart,
  Plus,
  BookOpen,
  Clock,
  Download,
  TrendingUp,
  MessageSquare,
  Calendar,
  Eye,
  Edit,
  User,
  AlertCircle,
} from "lucide-react";

interface DashboardData {
  obituaries: any[];
  tributesReceived: any[];
  legacyOrders: any[];
  stats: {
    totalObituaries: number;
    publishedObituaries: number;
    approvedObituaries: number;
    memorializedObituaries: number;
    pendingObituaries: number;
    rejectedObituaries: number;
    totalTributesReceived: number;
    legacyOrders: number;
    completedLegacyOrders: number;
  };
  recentTributes: any[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedObituary, setSelectedObituary] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user info
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();

      if (!userData.user) {
        router.push("/login");
        return;
      }

      setUser(userData.user);

      // Get dashboard data
      const dashboardRes = await fetch("/api/dashboard");
      const dashboardResult = await dashboardRes.json();

      if (!dashboardResult.success) {
        throw new Error(
          dashboardResult.error || "Failed to fetch dashboard data"
        );
      }

      setDashboardData(dashboardResult.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewObituary = (obituary: any) => {
    setSelectedObituary(obituary);
    setViewModalOpen(true);
  };

  const handleEditObituary = (obituary: any) => {
    setSelectedObituary(obituary);
    setEditModalOpen(true);
  };

  const handleObituaryUpdate = () => {
    fetchDashboardData(); // Refresh data after update
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!user || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4">Please log in to access your dashboard.</p>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { obituaries, tributesReceived, legacyOrders, stats, recentTributes } =
    dashboardData;

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
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 space-y-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
              <p className="text-muted-foreground">
                Manage your obituaries and preserve precious memories
              </p>
            </div>
            <Link href="/obituaries/new">
              <Button size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Create New Obituary
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Obituaries
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalObituaries}
                </div>
                <p className="text-xs text-muted-foreground">
                  All your created obituaries
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.publishedObituaries}
                </div>
                <p className="text-xs text-muted-foreground">Live obituaries</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.approvedObituaries}
                </div>
                <p className="text-xs text-muted-foreground">Admin approved</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.pendingObituaries}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tributes</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalTributesReceived}
                </div>
                <p className="text-xs text-muted-foreground">Total received</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          {recentTributes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Tributes received in the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTributes.slice(0, 5).map((tribute: any) => (
                    <div
                      key={tribute._id}
                      className="flex items-start gap-4 p-3 rounded-lg bg-muted/30"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {tribute.name}
                          </span>
                          {tribute.relationship && (
                            <>
                              <span className="text-xs text-muted-foreground">
                                •
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {tribute.relationship}
                              </span>
                            </>
                          )}
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(tribute.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          Left a tribute on {tribute.tributeId?.name}: "
                          {tribute.message.substring(0, 100)}..."
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Link href="/dashboard/tributes">
                      <Button variant="outline" size="sm">
                        View All Tributes
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Obituaries */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Obituaries</CardTitle>
                  <CardDescription>
                    {stats.totalObituaries > 0
                      ? `Manage and view your ${stats.totalObituaries} obituar${
                          stats.totalObituaries === 1 ? "y" : "ies"
                        }`
                      : "Create your first obituary to get started"}
                  </CardDescription>
                </div>
                <Link href="/dashboard/obituaries">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {obituaries.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No obituaries yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first obituary to honor a loved one
                  </p>
                  <Link href="/obituaries/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Obituary
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {obituaries.slice(0, 6).map((obituary: any) => (
                    <Card key={obituary._id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          alt="Portrait"
                          className="w-full h-full object-cover"
                          src={
                            obituary.images?.find(
                              (i: any) => i.type === "portrait"
                            )?.url ||
                            "/placeholder.svg?height=200&width=300&query=portrait+memorial+placeholder"
                          }
                        />
                        <div className="absolute top-2 right-2">
                          <StatusBadge status={obituary.status} />
                        </div>
                        {obituary.paid && (
                          <div className="absolute top-2 left-2">
                            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Paid
                            </div>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">
                          {obituary.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {obituary.dob} — {obituary.dod}
                        </p>
                        <div className="text-xs text-muted-foreground mb-3">
                          Created{" "}
                          {new Date(obituary.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewObituary(obituary)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditObituary(obituary)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          {(obituary.status === "memorialized" ||
                            obituary.status === "published" ||
                            obituary.status === "approved") && (
                            <Link
                              href={`/api/tributes/${obituary._id}/download`}
                            >
                              <Button variant="outline" size="sm">
                                <Download className="w-3 h-3 mr-1" />
                                ZIP
                              </Button>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legacy Books Summary */}
          {legacyOrders.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Legacy Books
                    </CardTitle>
                    <CardDescription>
                      {stats.legacyOrders} order
                      {stats.legacyOrders !== 1 ? "s" : ""},{" "}
                      {stats.completedLegacyOrders} completed
                    </CardDescription>
                  </div>
                  <Link href="/dashboard/legacy-books">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {legacyOrders.slice(0, 4).map((order: any) => (
                    <div
                      key={order._id}
                      className="flex items-center gap-4 p-3 rounded-lg border"
                    >
                      <BookOpen className="w-8 h-8 text-primary" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{order.deceasedName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.packageType === "design"
                            ? "Design Only"
                            : "Full Curation"}
                        </div>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tributes Summary */}
          {tributesReceived.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Recent Tributes
                    </CardTitle>
                    <CardDescription>
                      Latest condolence messages from friends and family
                    </CardDescription>
                  </div>
                  <Link href="/dashboard/tributes">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tributesReceived.slice(0, 3).map((tribute: any) => (
                    <div
                      key={tribute._id}
                      className="border rounded-lg p-4 bg-muted/30"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {tribute.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {tribute.relationship &&
                                `${tribute.relationship} • `}
                              On {tribute.tributeId?.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(tribute.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed pl-11 line-clamp-3">
                        {tribute.message}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Legacy Book
                </CardTitle>
                <CardDescription>
                  Order a curated legacy book to preserve memories in print
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/legacy-book">
                  <Button className="w-full">Order Now</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  View Tributes
                </CardTitle>
                <CardDescription>
                  See all condolence messages received on your obituaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/tributes">
                  <Button variant="outline" className="w-full bg-transparent">
                    View {stats.totalTributesReceived} Tribute
                    {stats.totalTributesReceived !== 1 ? "s" : ""}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Create Memorial
                </CardTitle>
                <CardDescription>
                  Honor another loved one with a new obituary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/obituaries/new">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>

      {/* Modals */}
      <ObituaryViewModal
        obituary={selectedObituary}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
      />
      <ObituaryEditModal
        obituary={selectedObituary}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onUpdate={handleObituaryUpdate}
      />
    </SidebarProvider>
  );
}
