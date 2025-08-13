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
import {
  BookOpen,
  CheckCircle,
  UserCheck,
  Download,
  Calendar,
  Loader2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

interface LegacyOrdersData {
  orders: any[];
  userMap: Record<string, any>;
  stats: {
    total: number;
    pending: number;
    approved: number;
    assigned: number;
    completed: number;
    designPackages: number;
    fullPackages: number;
  };
}

export default function AdminLegacyOrdersPage() {
  const [data, setData] = useState<LegacyOrdersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    fetchData();
  }, [status]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.set("status", status);

      const response = await fetch(`/api/admin/legacy-orders?${params}`);
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
                <BreadcrumbPage>Legacy Orders</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Legacy Book Orders</h1>
              <p className="text-muted-foreground">
                Manage legacy book orders and assignments
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {data.stats.designPackages} design, {data.stats.fullPackages}{" "}
                  full
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.pending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.assigned}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.completed}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Filter by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Link href="/admin/legacy-orders">
                  <Button variant={!status ? "default" : "outline"} size="sm">
                    All ({data.stats.total})
                  </Button>
                </Link>
                <Link href="/admin/legacy-orders?status=pending">
                  <Button
                    variant={status === "pending" ? "default" : "outline"}
                    size="sm"
                  >
                    Pending ({data.stats.pending})
                  </Button>
                </Link>
                <Link href="/admin/legacy-orders?status=approved">
                  <Button
                    variant={status === "approved" ? "default" : "outline"}
                    size="sm"
                  >
                    Approved ({data.stats.approved})
                  </Button>
                </Link>
                <Link href="/admin/legacy-orders?status=assigned">
                  <Button
                    variant={status === "assigned" ? "default" : "outline"}
                    size="sm"
                  >
                    Assigned ({data.stats.assigned})
                  </Button>
                </Link>
                <Link href="/admin/legacy-orders?status=completed">
                  <Button
                    variant={status === "completed" ? "default" : "outline"}
                    size="sm"
                  >
                    Completed ({data.stats.completed})
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <div className="space-y-4">
            {data.orders.map((order: any) => {
              const orderUser =
                data.userMap[order.userId?.toString()] || order.userId;
              const assignedUser = order.assignedToUserId
                ? data.userMap[order.assignedToUserId.toString()]
                : null;

              return (
                <Card
                  key={order._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex items-center gap-4">
                          <BookOpen className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg">
                              {order.deceasedName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Requested by {order.requesterName}
                            </p>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Package:</span>{" "}
                            <span className="capitalize">
                              {order.packageType === "design"
                                ? "Design Only (KES 50,000)"
                                : "Full Curation (KES 100,000)"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Contact:</span>{" "}
                            {order.contact}
                          </div>
                          {order.deadline && (
                            <div>
                              <span className="font-medium">Deadline:</span>{" "}
                              {new Date(order.deadline).toLocaleDateString()}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Ordered:</span>{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Customer:</span>{" "}
                            {orderUser?.name || "Unknown"} (
                            {orderUser?.email || "N/A"})
                          </div>
                          {order.mpesaCode && (
                            <div>
                              <span className="font-medium">M-Pesa:</span>{" "}
                              <span className="font-mono">
                                {order.mpesaCode}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {order.description && (
                          <div>
                            <span className="font-medium text-sm">
                              Description:
                            </span>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                              {order.description}
                            </p>
                          </div>
                        )}

                        {/* Assignment Info */}
                        {assignedUser && (
                          <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-primary" />
                              <span className="font-medium">Assigned to:</span>
                              <span>
                                {assignedUser.name} ({assignedUser.email})
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <StatusBadge status={order.status} />

                        <div className="flex flex-col gap-2">
                          {order.status === "pending" && (
                            <Button size="sm" className="w-full">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                          )}

                          {(order.status === "approved" ||
                            order.status === "assigned") && (
                            <div className="space-y-2">
                              <select className="text-xs border rounded px-2 py-1">
                                <option value="">Assign Designer</option>
                                {Object.values(data.userMap)
                                  .filter((u: any) => u.role === "admin")
                                  .map((designer: any) => (
                                    <option
                                      key={designer._id}
                                      value={designer._id.toString()}
                                    >
                                      {designer.name}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          )}

                          {order.status === "completed" && order.zipBook && (
                            <Link href={order.zipBook.url} target="_blank">
                              <Button size="sm" variant="outline">
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {data.orders.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No orders found
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {status
                      ? `No ${status} legacy book orders.`
                      : "No legacy book orders have been placed yet."}
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
