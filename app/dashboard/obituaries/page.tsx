"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
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
import {
  Heart,
  Plus,
  Download,
  Eye,
  Calendar,
  Users,
  MapPin,
  Phone,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { ObituaryViewModal } from "@/components/obituary-view-modal";

export default function UserObituariesPage() {
  const [user, setUser] = useState<any>(null);
  const [obituaries, setObituaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedObituary, setSelectedObituary] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user info
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();
      if (!userData.user) {
        window.location.href = "/login";
        return;
      }
      setUser(userData.user);

      // Get user obituaries
      const obituariesRes = await fetch("/api/user/obituaries");
      if (!obituariesRes.ok) {
        throw new Error("Failed to fetch obituaries");
      }
      const obituariesData = await obituariesRes.json();
      setObituaries(obituariesData.obituaries || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewObituary = (obituary: any) => {
    setSelectedObituary(obituary);
    setViewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading your obituaries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!user) return null;

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
              <BreadcrumbPage>My Obituaries</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Obituaries</h1>
            <p className="text-muted-foreground">
              View and manage all your created obituaries and memorials
            </p>
          </div>
          <Link href="/obituaries/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Obituary
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Obituaries
              </CardTitle>
              <Heart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {obituaries.length}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card className="border-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Published
              </CardTitle>
              <Eye className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {
                  obituaries.filter((o) =>
                    ["published", "approved"].includes(o.status)
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Live & viewable</p>
            </CardContent>
          </Card>
          <Card className="border-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Memorialized
              </CardTitle>
              <Heart className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {obituaries.filter((o) => o.status === "memorialized").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Permanent memorials
              </p>
            </CardContent>
          </Card>
          <Card className="border-orange-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending
              </CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {obituaries.filter((o) => o.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
        </div>

        {/* Obituaries Grid */}
        {obituaries.length === 0 ? (
          <Card className="border-blue-100">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                No obituaries yet
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Create your first obituary to honor a loved one and preserve
                their memory for generations to come.
              </p>
              <Link href="/obituaries/new">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Obituary
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {obituaries.map((obituary: any) => (
              <Card
                key={obituary._id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-100 hover:border-blue-200 group"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    alt={`Portrait of ${obituary.fullName || obituary.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={
                      obituary.mainPortrait?.url ||
                      obituary.images?.find((i: any) => i.type === "portrait")
                        ?.url ||
                      "/placeholder.svg?height=240&width=320&query=memorial+portrait" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={obituary.status} />
                  </div>
                  {obituary.paid && (
                    <div className="absolute top-3 left-3">
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Paid
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-lg leading-tight mb-1">
                      {obituary.fullName || obituary.name}
                    </h3>
                    <p className="text-sm opacity-90">
                      {obituary.dateOfBirth || obituary.dob} —{" "}
                      {obituary.dateOfDeath || obituary.dod}
                    </p>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  {obituary.epitaph && (
                    <blockquote className="text-sm text-blue-700 italic border-l-2 border-blue-200 pl-3">
                      "{obituary.epitaph}"
                    </blockquote>
                  )}

                  <div className="space-y-2">
                    {/* Publisher Info */}
                    {obituary.publisher && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3 h-3 text-blue-500" />
                        <span className="truncate">
                          Published by {obituary.publisher.name}
                          {obituary.publisher.relationship &&
                            ` (${obituary.publisher.relationship})`}
                        </span>
                      </div>
                    )}

                    {/* Family Tree Count */}
                    {obituary.familyTree && obituary.familyTree.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-3 h-3 text-blue-500" />
                        <span>
                          {obituary.familyTree.length} family member
                          {obituary.familyTree.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}

                    {/* Services Info */}
                    {((obituary.memorialServices &&
                      obituary.memorialServices.length > 0) ||
                      (obituary.burialServices &&
                        obituary.burialServices.length > 0) ||
                      obituary.funeralInfo?.venue) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3 text-blue-500" />
                        <span className="truncate">
                          {obituary.funeralInfo?.venue ||
                            `${
                              (obituary.memorialServices?.length || 0) +
                              (obituary.burialServices?.length || 0)
                            } service${
                              (obituary.memorialServices?.length || 0) +
                                (obituary.burialServices?.length || 0) !==
                              1
                                ? "s"
                                : ""
                            }`}
                        </span>
                      </div>
                    )}

                    {/* Created Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      <span>
                        Created{" "}
                        {new Date(obituary.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewObituary(obituary)}
                      className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    <Link href={`/obituaries/${obituary._id}`} target="_blank">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Public
                      </Button>
                    </Link>
                    {(obituary.status === "memorialized" ||
                      obituary.status === "published" ||
                      obituary.status === "approved") && (
                      <Link href={`/api/tributes/${obituary._id}/download`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                        >
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

        {/* Quick Actions */}
        {obituaries.length > 0 && (
          <Card className="border-blue-100 bg-blue-50/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Need to make changes?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Edit your obituaries by visiting the creation page or
                    contact support for assistance.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link href="/obituaries/new">
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      Edit Obituary
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* View Modal */}
      <ObituaryViewModal
        obituary={selectedObituary}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
      />
    </>
  );
}
