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
  Briefcase,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Loader2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

interface ServicesData {
  services: any[];
  userMap: Record<string, any>;
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  categories: string[];
}

export default function AdminServicesPage() {
  const [data, setData] = useState<ServicesData | null>(null);
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

      const response = await fetch(`/api/admin/services?${params}`);
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
    "funeral",
    "catering",
    "transport",
    "flowers",
    "photography",
    "music",
    "other",
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
                <BreadcrumbPage>Services</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Services Management</h1>
              <p className="text-muted-foreground">
                Manage service provider listings and approvals
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Services
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.total}</div>
                <p className="text-xs text-muted-foreground">All submissions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.pending}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.approved}</div>
                <p className="text-xs text-muted-foreground">Live listings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Categories
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories.length}</div>
                <p className="text-xs text-muted-foreground">Service types</p>
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
                    <Link href="/admin/services">
                      <Button
                        variant={!status ? "default" : "outline"}
                        size="sm"
                      >
                        All ({data.stats.total})
                      </Button>
                    </Link>
                    <Link href="/admin/services?status=pending">
                      <Button
                        variant={status === "pending" ? "default" : "outline"}
                        size="sm"
                      >
                        Pending ({data.stats.pending})
                      </Button>
                    </Link>
                    <Link href="/admin/services?status=approved">
                      <Button
                        variant={status === "approved" ? "default" : "outline"}
                        size="sm"
                      >
                        Approved ({data.stats.approved})
                      </Button>
                    </Link>
                    <Link href="/admin/services?status=rejected">
                      <Button
                        variant={status === "rejected" ? "default" : "outline"}
                        size="sm"
                      >
                        Rejected ({data.stats.rejected})
                      </Button>
                    </Link>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Link href="/admin/services">
                      <Button
                        variant={!category ? "default" : "outline"}
                        size="sm"
                      >
                        All Categories
                      </Button>
                    </Link>
                    {categories.map((cat) => (
                      <Link key={cat} href={`/admin/services?category=${cat}`}>
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

          {/* Services List */}
          <div className="space-y-4">
            {data.services.map((service: any) => {
              const submitter =
                data.userMap[service.submittedByUserId?.toString()] ||
                service.submittedByUserId;

              return (
                <Card
                  key={service._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Logo */}
                      <div className="flex-shrink-0">
                        {service.logo?.url ? (
                          <img
                            src={service.logo.url || "/placeholder.svg"}
                            alt={service.businessName}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {service.businessName}
                            </h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {service.category} • {service.location}
                            </p>
                          </div>
                          <StatusBadge status={service.status} />
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{service.contact}</span>
                          </div>
                          {service.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span>{service.email}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{service.location}</span>
                          </div>
                        </div>

                        {service.description && (
                          <div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {service.description}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-medium">Submitted by:</span>{" "}
                            {submitter?.name || "Unknown"} (
                            {submitter?.email || "N/A"})
                            <br />
                            <span className="text-muted-foreground">
                              {new Date(service.createdAt).toLocaleDateString()}
                            </span>
                            {service.mpesaCode && (
                              <>
                                <br />
                                <span className="font-medium">
                                  M-Pesa:
                                </span>{" "}
                                <span className="font-mono">
                                  {service.mpesaCode}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {service.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="destructive">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {data.services.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Briefcase className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No services found
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {status || category
                      ? "No services match the current filters."
                      : "No services have been submitted yet."}
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
