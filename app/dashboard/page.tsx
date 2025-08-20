"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  FileText,
  Heart,
  BookOpen,
  TrendingUp,
  Calendar,
  User,
  Eye,
  Settings,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalObituaries: number;
  publishedObituaries: number;
  pendingObituaries: number;
  approvedObituaries: number;
  rejectedObituaries: number;
  draftObituaries: number;
  totalTributes: number;
  recentTributes: number;
  totalLegacyOrders: number;
  completedLegacyOrders: number;
}

interface RecentObituary {
  _id: string;
  fullName: string;
  mainPortrait?: {
    url: string;
  };
  status: string;
  createdAt: string;
  dateOfBirth: string;
  dateOfDeath: string;
  epitaph?: string;
  publisher: {
    name: string;
    relationship: string;
  };
  familyTree: Array<{ name: string; relationship: string }>;
  memorialServices: Array<{ venue: string; date: string }>;
  burialServices: Array<{ venue: string; date: string }>;
}

interface RecentTribute {
  _id: string;
  authorName: string;
  authorRelationship: string;
  content: string;
  createdAt: string;
  tributeId: {
    _id: string;
    fullName: string;
    mainPortrait?: {
      url: string;
    };
  };
}

interface RecentLegacyOrder {
  _id: string;
  packageType: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentObituaries: RecentObituary[];
  recentTributes: RecentTribute[];
  recentLegacyOrders: RecentLegacyOrder[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch dashboard data");
      }

      console.log("Dashboard data received:", result);
      setData(result);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "draft":
        return <Edit className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg text-center">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-4">
        <div className="text-red-600 text-lg text-center">
          Error loading dashboard: {error}
        </div>
        <Button onClick={fetchDashboardData} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <div className="text-lg text-center">No data available</div>
      </div>
    );
  }

  const { stats } = data;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome back! Here's an overview of your memorial activities.
        </p>
      </div>

      {/* Quick Actions - Mobile First */}
      <div className="block sm:hidden">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/obituaries/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Obituary
              </Link>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/obituaries">My Obituaries</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/tributes">Tributes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Obituaries
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalObituaries || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span className="truncate">
                {stats?.publishedObituaries || 0} published,{" "}
                {stats?.draftObituaries || 0} drafts
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tributes Received
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalTributes || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span className="truncate">
                {stats?.recentTributes || 0} this week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Legacy Orders</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalLegacyOrders || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span className="truncate">
                {stats?.completedLegacyOrders || 0} completed
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.pendingObituaries || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="truncate">
                {stats?.approvedObituaries || 0} approved,{" "}
                {stats?.rejectedObituaries || 0} rejected
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      {stats?.totalObituaries > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Obituary Status Breakdown
            </CardTitle>
            <CardDescription className="text-sm">
              Current status of all your obituaries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {stats.publishedObituaries > 0 && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-lg">
                      {stats.publishedObituaries}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Published
                    </div>
                  </div>
                </div>
              )}
              {stats.approvedObituaries > 0 && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-lg">
                      {stats.approvedObituaries}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Approved
                    </div>
                  </div>
                </div>
              )}
              {stats.pendingObituaries > 0 && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-lg">
                      {stats.pendingObituaries}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                </div>
              )}
              {stats.draftObituaries > 0 && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Edit className="h-5 w-5 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-lg">
                      {stats.draftObituaries}
                    </div>
                    <div className="text-sm text-muted-foreground">Drafts</div>
                  </div>
                </div>
              )}
              {stats.rejectedObituaries > 0 && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-lg">
                      {stats.rejectedObituaries}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Rejected
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Obituaries */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                Recent Obituaries
              </CardTitle>
              <CardDescription className="text-sm">
                Your latest memorial publications
              </CardDescription>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full sm:w-auto bg-transparent"
            >
              <Link href="/dashboard/obituaries">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.recentObituaries.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No obituaries yet</h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Create your first memorial to get started
              </p>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/obituaries/new">Create Obituary</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {data.recentObituaries.map((obituary) => (
                <div
                  key={obituary._id}
                  className="flex flex-col sm:flex-row items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                      <AvatarImage
                        src={
                          obituary.mainPortrait?.url ||
                          "/placeholder.svg?height=80&width=80"
                        }
                        alt={obituary.fullName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 text-lg font-semibold">
                        {/* {obituary.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()} */}
                        {obituary.fullName}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2 text-center sm:text-left">
                          {obituary.fullName}
                        </h3>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1 justify-center sm:justify-start">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              {formatDate(obituary.dateOfBirth)} -{" "}
                              {formatDate(obituary.dateOfDeath)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 justify-center sm:justify-start">
                            <User className="h-4 w-4 flex-shrink-0" />
                            <span className="text-blue-600 truncate">
                              {obituary.publisher?.name} (
                              {obituary.publisher?.relationship})
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-sm text-gray-500 mb-3">
                          <span className="whitespace-nowrap">
                            {obituary.familyTree?.length || 0} family members
                          </span>
                          <span className="whitespace-nowrap">
                            {(obituary.memorialServices?.length || 0) +
                              (obituary.burialServices?.length || 0)}{" "}
                            services
                          </span>
                          <span className="whitespace-nowrap">
                            Created {formatDate(obituary.createdAt)}
                          </span>
                        </div>

                        {obituary.epitaph && (
                          <blockquote className="border-l-4 border-blue-200 pl-4 italic text-gray-700 mb-3 text-sm sm:text-base">
                            "{obituary.epitaph}"
                          </blockquote>
                        )}
                      </div>

                      <div className="flex flex-col items-center lg:items-end gap-3 w-full lg:w-auto">
                        <Badge
                          className={`${getStatusColor(
                            obituary.status
                          )} flex items-center gap-1 w-fit`}
                        >
                          {getStatusIcon(obituary.status)}
                          <span className="capitalize">{obituary.status}</span>
                        </Badge>
                        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 w-full lg:w-auto">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto bg-transparent"
                          >
                            <Link href={`/obituaries/${obituary._id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">View</span>
                              <span className="sm:hidden">View Public</span>
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto bg-transparent"
                          >
                            <Link href="/dashboard/obituaries">
                              <Settings className="h-4 w-4 mr-1" />
                              Manage
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Tributes and Legacy Orders */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Tributes */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg sm:text-xl">
                  Recent Tributes
                </CardTitle>
                <CardDescription className="text-sm">
                  Latest condolences from the community
                </CardDescription>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full sm:w-auto bg-transparent"
              >
                <Link href="/dashboard/tributes">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {data.recentTributes.length === 0 ? (
              <div className="text-center py-6">
                <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No tributes yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentTributes.map((tribute) => (
                  <div
                    key={tribute._id}
                    className="flex gap-3 p-3 border rounded-lg"
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {tribute.authorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <span className="font-medium text-sm truncate">
                          {tribute.authorName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({tribute.authorRelationship})
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {tribute.content}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                        <span className="truncate">
                          For {tribute.tributeId.fullName}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="whitespace-nowrap">
                          {formatDate(tribute.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Legacy Orders */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg sm:text-xl">
                  Recent Legacy Orders
                </CardTitle>
                <CardDescription className="text-sm">
                  Your latest memorial book orders
                </CardDescription>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full sm:w-auto bg-transparent"
              >
                <Link href="/dashboard/legacy-books">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {data.recentLegacyOrders.length === 0 ? (
              <div className="text-center py-6">
                <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No orders yet</p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full sm:w-auto bg-transparent"
                >
                  <Link href="/legacy-book">Order Legacy Book</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentLegacyOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm mb-1 truncate">
                        {order.packageType}
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Status: {order.status}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <div className="text-sm font-medium mt-1">
                        KSh {order.totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
