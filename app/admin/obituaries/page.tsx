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
import { ObituaryViewModal } from "@/components/obituary-view-modal";
import { toast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  DollarSign,
  Loader2,
  Eye,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

interface ObituaryData {
  obituaries: any[];
  userMap: Record<string, any>;
  stats: {
    total: number;
    pending: number;
    approved: number;
    published: number;
    rejected: number;
    draft: number;
    paid: number;
    unpaid: number;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function AdminObituariesPage() {
  const [data, setData] = useState<ObituaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedObituary, setSelectedObituary] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    fetchData();
  }, [status, page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      params.set("page", page);

      const response = await fetch(`/api/admin/obituaries?${params}`);
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

  const handleViewObituary = (obituary: any) => {
    setSelectedObituary(obituary);
    setModalOpen(true);
  };

  const handleApprove = async (obituaryId: string) => {
    setActionLoading(obituaryId);
    try {
      const response = await fetch(`/api/tributes/${obituaryId}/approve`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to approve obituary");
      }

      toast({
        title: "Success",
        description: "Obituary approved successfully",
      });

      // Refresh data
      await fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve obituary",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (obituaryId: string) => {
    setActionLoading(obituaryId);
    try {
      const response = await fetch(`/api/tributes/${obituaryId}/reject`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to reject obituary");
      }

      toast({
        title: "Success",
        description: "Obituary rejected successfully",
      });

      // Refresh data
      await fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject obituary",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
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
                <BreadcrumbPage>Obituaries</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Obituaries Management</h1>
              <p className="text-muted-foreground">
                Manage all obituaries and their publication status
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Obituaries
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.total}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Review
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.pending}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.approved}</div>
                <p className="text-xs text-muted-foreground">Live on site</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Payment Status
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.paid}</div>
                <p className="text-xs text-muted-foreground">
                  {data.stats.unpaid} unpaid
                </p>
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
                <Link href="/admin/obituaries">
                  <Button variant={!status ? "default" : "outline"} size="sm">
                    All ({data.stats.total})
                  </Button>
                </Link>
                <Link href="/admin/obituaries?status=pending">
                  <Button
                    variant={status === "pending" ? "default" : "outline"}
                    size="sm"
                  >
                    Pending ({data.stats.pending})
                  </Button>
                </Link>
                <Link href="/admin/obituaries?status=approved">
                  <Button
                    variant={status === "approved" ? "default" : "outline"}
                    size="sm"
                  >
                    Approved ({data.stats.approved})
                  </Button>
                </Link>
                <Link href="/admin/obituaries?status=published">
                  <Button
                    variant={status === "published" ? "default" : "outline"}
                    size="sm"
                  >
                    Published ({data.stats.published})
                  </Button>
                </Link>
                <Link href="/admin/obituaries?status=rejected">
                  <Button
                    variant={status === "rejected" ? "default" : "outline"}
                    size="sm"
                  >
                    Rejected ({data.stats.rejected})
                  </Button>
                </Link>
                <Link href="/admin/obituaries?status=draft">
                  <Button
                    variant={status === "draft" ? "default" : "outline"}
                    size="sm"
                  >
                    Draft ({data.stats.draft})
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Obituaries List */}
          <div className="space-y-4">
            {data.obituaries.map((obituary: any) => {
              const obituaryUser =
                data.userMap[obituary.userId?.toString()] || obituary.userId;
              const portrait = obituary.images?.find(
                (i: any) => i.type === "portrait"
              );

              return (
                <Card
                  key={obituary._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Portrait */}
                      <div className="flex-shrink-0">
                        {portrait?.url ? (
                          <img
                            src={portrait.url || "/placeholder.svg"}
                            alt={obituary.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                            <Users className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {obituary.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {obituary.dob && obituary.dod
                                ? `${obituary.dob} - ${obituary.dod}`
                                : "Dates not specified"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={obituary.status} />
                            {obituary.paid !== undefined && (
                              <StatusBadge
                                status={obituary.paid ? "paid" : "unpaid"}
                              />
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Created by:</span>{" "}
                            {obituaryUser?.name || "Unknown"} (
                            {obituaryUser?.email || "N/A"})
                          </div>
                          <div>
                            <span className="font-medium">Created:</span>{" "}
                            {new Date(obituary.createdAt).toLocaleDateString()}
                          </div>
                          {obituary.location && (
                            <div>
                              <span className="font-medium">Location:</span>{" "}
                              {obituary.location}
                            </div>
                          )}
                          {obituary.mpesaCode && (
                            <div>
                              <span className="font-medium">M-Pesa Code:</span>{" "}
                              <span className="font-mono">
                                {obituary.mpesaCode}
                              </span>
                            </div>
                          )}
                        </div>

                        {obituary.eulogy && (
                          <div>
                            <span className="font-medium text-sm">Eulogy:</span>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                              {obituary.eulogy}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewObituary(obituary)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Link
                            href={`/obituaries/${obituary._id}`}
                            target="_blank"
                          >
                            <Button size="sm" variant="outline">
                              Public View
                            </Button>
                          </Link>
                          {obituary.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprove(obituary._id)}
                                disabled={actionLoading === obituary._id}
                              >
                                {actionLoading === obituary._id ? (
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                )}
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(obituary._id)}
                                disabled={actionLoading === obituary._id}
                              >
                                {actionLoading === obituary._id ? (
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                ) : (
                                  <XCircle className="w-3 h-3 mr-1" />
                                )}
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {data.obituaries.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No obituaries found
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {status
                      ? `No ${status} obituaries found.`
                      : "No obituaries have been created yet."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from(
                { length: data.pagination.totalPages },
                (_, i) => i + 1
              ).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/admin/obituaries?${new URLSearchParams({
                    ...(status && { status }),
                    page: pageNum.toString(),
                  })}`}
                >
                  <Button
                    variant={
                      data.pagination.currentPage === pageNum
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                  >
                    {pageNum}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </main>
      </SidebarInset>

      {/* Obituary View Modal */}
      <ObituaryViewModal
        obituary={selectedObituary}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </SidebarProvider>
  );
}
