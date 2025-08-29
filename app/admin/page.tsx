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
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Users,
  Heart,
  Settings,
  BookOpen,
  MessageSquare,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Activity,
} from "lucide-react";

interface DashboardData {
  statistics: {
    tributes: {
      total: number;
      pending: number;
      approved: number;
      recent: number;
      growth: string;
    };
    users: {
      total: number;
      recent: number;
      growth: string;
    };
    services: {
      total: number;
      pending: number;
      approved: number;
      recent: number;
    };
    orders: {
      total: number;
      pending: number;
      completed: number;
      recent: number;
    };
    blog: {
      total: number;
      published: number;
      draft: number;
      recent: number;
    };
  };
  recentActivity: {
    tributes: Array<{
      _id: string;
      authorName: string;
      message: string;
      createdAt: string;
      obituaryId: { name: string };
    }>;
    users: Array<{
      _id: string;
      name: string;
      email: string;
      createdAt: string;
      role: string;
    }>;
    services: Array<{
      _id: string;
      businessName: string;
      category: string;
      status: string;
      createdAt: string;
      submittedBy: { name: string; email: string };
    }>;
    orders: Array<{
      _id: string;
      deceasedName: string;
      packageType: string;
      status: string;
      createdAt: string;
      customerEmail: string;
    }>;
  };
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication first
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();

      setAuthChecked(true);

      // If no user or not admin, redirect to login
      if (!userData.user) {
        router.push("/login");
        return;
      }

      if (userData.user.role !== "admin") {
        setError("You don't have admin privileges");
        return;
      }

      setUser(userData.user);

      // Fetch dashboard data
      const dashboardRes = await fetch("/api/admin/dashboard");
      console.log(dashboardRes);

      if (!dashboardRes.ok) {
        if (dashboardRes.status === 403) {
          setError("Access denied. Admin privileges required.");
          return;
        }
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await dashboardRes.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth
  if (!authChecked || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="space-x-2">
            <Button onClick={checkAuthAndFetchData}>Try Again</Button>
            <Button variant="outline" onClick={() => router.push("/login")}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If no user after auth check, don't render anything (redirect will happen)
  if (!user) {
    return null;
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const { statistics, recentActivity } = dashboardData;

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
                <BreadcrumbPage>Admin Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 space-y-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage and monitor the Tuliamani platform
              </p>
            </div>
            <Button onClick={checkAuthAndFetchData} variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>

          {/* Main Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics.users.total}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {Number.parseFloat(statistics.users.growth) > 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                  )}
                  {statistics.users.growth}% from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Obituaries
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics.tributes.total}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {Number.parseFloat(statistics.tributes.growth) > 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                  )}
                  {statistics.tributes.growth}% from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Services</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics.services.total}
                </div>
                <p className="text-xs text-muted-foreground">
                  {statistics.services.pending} pending approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Legacy Orders
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics.orders.total}
                </div>
                <p className="text-xs text-muted-foreground">
                  {statistics.orders.pending} pending
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Statistics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Obituary Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="font-semibold">
                    {statistics.tributes.pending}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Approved</span>
                  </div>
                  <span className="font-semibold">
                    {statistics.tributes.approved}
                  </span>
                </div>
                <div className="pt-2">
                  <Link href="/admin/tributes">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                    >
                      Manage Tributes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Service Providers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="font-semibold">
                    {statistics.services.pending}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Approved</span>
                  </div>
                  <span className="font-semibold">
                    {statistics.services.approved}
                  </span>
                </div>
                <div className="pt-2">
                  <Link href="/admin/directory">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                    >
                      Manage Services
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Blog Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Published</span>
                  </div>
                  <span className="font-semibold">
                    {statistics.blog.published}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Drafts</span>
                  </div>
                  <span className="font-semibold">{statistics.blog.draft}</span>
                </div>
                <div className="pt-2">
                  <Link href="/admin/blog">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                    >
                      Manage Blog
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Recent Users
                </CardTitle>
                <CardDescription>
                  New user registrations this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.users.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No new users this week
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.users.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Recent Tributes
                </CardTitle>
                <CardDescription>Latest tribute messages</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.tributes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No recent tributes
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.tributes.map((tribute) => (
                      <div
                        key={tribute._id}
                        className="flex items-start gap-3 p-2 rounded-lg bg-muted/30"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Heart className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">
                            {tribute.authorName}
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">
                            For: {tribute.obituaryId?.name}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {tribute.message?.substring(0, 80)}...
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(tribute.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/obituaries">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Heart className="w-5 h-5 text-primary" />
                    Manage Obituaries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Review and manage all obituaries
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/users">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="w-5 h-5 text-primary" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View and manage user accounts
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/directory">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Settings className="w-5 h-5 text-primary" />
                    Service Providers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Approve and manage services
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/legacy-orders">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Legacy Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Process legacy book orders
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
