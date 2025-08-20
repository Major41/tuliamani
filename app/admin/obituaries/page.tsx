"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Check,
  X,
  Search,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Heart,
  Calendar,
  Phone,
  Mail,
  User,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminObituariesPage() {
  const [user, setUser] = useState<any>(null);
  const [obituaries, setObituaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedObituary, setSelectedObituary] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    published: 0,
    rejected: 0,
    draft: 0,
    paid: 0,
    unpaid: 0,
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchObituaries();
    }
  }, [user, statusFilter, searchTerm]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      if (data.user.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error("Auth check failed:", error);
      window.location.href = "/login";
    }
  };

  const fetchObituaries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/admin/obituaries?${params}`);
      const data = await response.json();

      if (response.ok) {
        setObituaries(data.obituaries || []);
        setStats(data.stats || {});
      } else {
        throw new Error(data.error || "Failed to fetch obituaries");
      }
    } catch (error) {
      console.error("Failed to fetch obituaries:", error);
      toast({
        title: "Error",
        description: "Failed to load obituaries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
        title: "Obituary Approved",
        description:
          "The obituary has been approved and is now visible to the public.",
      });

      setApprovalModalOpen(false);
      fetchObituaries(); // Refresh the list
    } catch (error) {
      console.error("Failed to approve obituary:", error);
      toast({
        title: "Error",
        description: "Failed to approve obituary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (obituaryId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this obituary.",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(obituaryId);
    try {
      const response = await fetch(`/api/tributes/${obituaryId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject obituary");
      }

      toast({
        title: "Obituary Rejected",
        description: "The obituary has been rejected with the provided reason.",
      });

      setRejectionModalOpen(false);
      setRejectionReason("");
      fetchObituaries(); // Refresh the list
    } catch (error) {
      console.error("Failed to reject obituary:", error);
      toast({
        title: "Error",
        description: "Failed to reject obituary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (obituary: any) => {
    setSelectedObituary(obituary);
    setDetailsModalOpen(true);
  };

  const openApprovalModal = (obituary: any) => {
    setSelectedObituary(obituary);
    setApprovalModalOpen(true);
  };

  const openRejectionModal = (obituary: any) => {
    setSelectedObituary(obituary);
    setRejectionModalOpen(true);
  };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredObituaries = obituaries.filter((obituary) => {
    const matchesSearch =
      !searchTerm ||
      obituary.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obituary.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obituary.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || obituary.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
                <BreadcrumbPage>Admin Obituaries</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Obituaries Management</h1>
              <p className="text-muted-foreground">
                Review and manage obituary submissions for publication
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All obituaries</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.approved}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ready to publish
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.published}
                </div>
                <p className="text-xs text-muted-foreground">Live on site</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </div>
                <p className="text-xs text-muted-foreground">Not approved</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.paid}
                </div>
                <p className="text-xs text-muted-foreground">
                  Payment confirmed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, creator, or content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "all",
                    "pending",
                    "approved",
                    "published",
                    "rejected",
                    "draft",
                  ].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Obituaries Table */}
          <Card>
            <CardHeader>
              <CardTitle>Obituaries ({filteredObituaries.length})</CardTitle>
              <CardDescription>
                {statusFilter === "all"
                  ? "All obituary submissions"
                  : `${
                      statusFilter.charAt(0).toUpperCase() +
                      statusFilter.slice(1)
                    } obituaries`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading obituaries...</p>
                </div>
              ) : filteredObituaries.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No obituaries found
                  </h3>
                  <p className="text-muted-foreground">
                    {statusFilter === "all"
                      ? "No obituaries have been submitted yet."
                      : `No ${statusFilter} obituaries found.`}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Photo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredObituaries.map((obituary: any) => {
                        const portrait =
                          obituary.images?.find(
                            (i: any) => i.type === "portrait"
                          ) || obituary.mainPortrait;

                        return (
                          <TableRow key={obituary._id}>
                            <TableCell>
                              <img
                                src={
                                  portrait?.url ||
                                  "/placeholder.svg?height=40&width=40&query=portrait"
                                }
                                alt="Portrait"
                                className="w-10 h-10 object-cover rounded-full"
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {obituary.name || obituary.fullName}
                                </div>
                                {obituary.epitaph && (
                                  <div className="text-sm text-muted-foreground italic">
                                    "{obituary.epitaph}"
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {obituary.dob || obituary.dateOfBirth} —<br />
                                {obituary.dod || obituary.dateOfDeath}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="font-medium">
                                  {obituary.userId?.name || "Unknown"}
                                </div>
                                <div className="text-muted-foreground">
                                  {obituary.userId?.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={obituary.status} />
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Badge
                                  variant={
                                    obituary.paid ? "default" : "secondary"
                                  }
                                >
                                  {obituary.paid ? "Paid" : "Unpaid"}
                                </Badge>
                                {obituary.mpesaCode && (
                                  <div className="text-xs text-muted-foreground">
                                    {obituary.mpesaCode}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(
                                  obituary.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetails(obituary)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {obituary.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        openApprovalModal(obituary)
                                      }
                                      disabled={actionLoading === obituary._id}
                                    >
                                      {actionLoading === obituary._id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                      ) : (
                                        <Check className="w-4 h-4" />
                                      )}
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() =>
                                        openRejectionModal(obituary)
                                      }
                                      disabled={actionLoading === obituary._id}
                                    >
                                      {actionLoading === obituary._id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                      ) : (
                                        <X className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Obituary Details</span>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedObituary?.status} />
                {selectedObituary?.paid && (
                  <Badge className="bg-green-100 text-green-800">Paid</Badge>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedObituary && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-64 relative">
                  <img
                    src={
                      selectedObituary.images?.find(
                        (i: any) => i.type === "portrait"
                      )?.url ||
                      selectedObituary.mainPortrait?.url ||
                      "/placeholder.svg?height=280&width=280&query=memorial+portrait" ||
                      "/placeholder.svg"
                    }
                    alt="Portrait"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold">
                      {selectedObituary.name || selectedObituary.fullName}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {selectedObituary.dob || selectedObituary.dateOfBirth} —{" "}
                      {selectedObituary.dod || selectedObituary.dateOfDeath}
                    </p>
                    {selectedObituary.epitaph && (
                      <blockquote className="text-lg italic border-l-4 border-primary pl-4 mt-3">
                        "{selectedObituary.epitaph}"
                      </blockquote>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      <StatusBadge status={selectedObituary.status} />
                    </div>
                    <div>
                      <span className="font-medium">Payment:</span>{" "}
                      <Badge
                        variant={
                          selectedObituary.paid ? "default" : "secondary"
                        }
                      >
                        {selectedObituary.paid ? "Paid" : "Unpaid"}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(
                        selectedObituary.createdAt
                      ).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Public Tributes:</span>{" "}
                      {selectedObituary.allowPublicTributes
                        ? "Allowed"
                        : "Disabled"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Life Story */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Life Story</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                  {selectedObituary.eulogy ||
                    selectedObituary.biography ||
                    "No life story provided"}
                </div>
              </div>

              {/* Photo Gallery */}
              {(selectedObituary.images?.filter(
                (i: any) => i.type === "gallery"
              )?.length > 0 ||
                selectedObituary.imageGallery?.length > 0) && (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Photo Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(
                      selectedObituary.images?.filter(
                        (i: any) => i.type === "gallery"
                      ) ||
                      selectedObituary.imageGallery ||
                      []
                    ).map((img: any, idx: number) => (
                      <img
                        key={idx}
                        src={img.url || img || "/placeholder.svg"}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Family Tree */}
              {selectedObituary.familyTree &&
                selectedObituary.familyTree.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">Family Members</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedObituary.familyTree.map(
                        (member: any, idx: number) => (
                          <div key={idx} className="bg-muted/30 p-3 rounded-lg">
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {member.relationship}
                            </div>
                            {member.description && (
                              <div className="text-sm mt-1">
                                {member.description}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Memorial Services */}
              {(selectedObituary.memorialServices?.length > 0 ||
                selectedObituary.burialServices?.length > 0) && (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Services</h3>
                  <div className="space-y-4">
                    {selectedObituary.memorialServices?.map(
                      (service: any, idx: number) => (
                        <div key={idx} className="bg-muted/30 p-4 rounded-lg">
                          <h4 className="font-medium">Memorial Service</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                            {service.date && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>{service.date}</span>
                              </div>
                            )}
                            {service.time && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{service.time}</span>
                              </div>
                            )}
                            {service.venue && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{service.venue}</span>
                              </div>
                            )}
                          </div>
                          {service.description && (
                            <p className="text-sm mt-2">
                              {service.description}
                            </p>
                          )}
                        </div>
                      )
                    )}
                    {selectedObituary.burialServices?.map(
                      (service: any, idx: number) => (
                        <div key={idx} className="bg-muted/30 p-4 rounded-lg">
                          <h4 className="font-medium">Burial Service</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                            {service.date && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>{service.date}</span>
                              </div>
                            )}
                            {service.time && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{service.time}</span>
                              </div>
                            )}
                            {service.venue && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{service.venue}</span>
                              </div>
                            )}
                          </div>
                          {service.description && (
                            <p className="text-sm mt-2">
                              {service.description}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Funeral Information */}
              {selectedObituary.funeralInfo &&
                (selectedObituary.funeralInfo.venue ||
                  selectedObituary.funeralInfo.time) && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">
                      Funeral Information
                    </h3>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                      {selectedObituary.funeralInfo.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>
                            <strong>Venue:</strong>{" "}
                            {selectedObituary.funeralInfo.venue}
                          </span>
                        </div>
                      )}
                      {selectedObituary.funeralInfo.time && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            <strong>Date & Time:</strong>{" "}
                            {selectedObituary.funeralInfo.time}
                          </span>
                        </div>
                      )}
                      {selectedObituary.funeralInfo.streamingLink && (
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          <span>
                            <strong>Live Stream:</strong>
                          </span>
                          <a
                            href={selectedObituary.funeralInfo.streamingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Watch Online
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Publisher/Contributor Information */}
              {(selectedObituary.publisher || selectedObituary.contributor) && (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">
                    Publisher Information
                  </h3>
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    {(selectedObituary.publisher?.name ||
                      selectedObituary.contributor?.name) && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>
                          <strong>Name:</strong>{" "}
                          {selectedObituary.publisher?.name ||
                            selectedObituary.contributor?.name}
                        </span>
                      </div>
                    )}
                    {(selectedObituary.publisher?.phone ||
                      selectedObituary.contributor?.phone) && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>
                          <strong>Phone:</strong>{" "}
                          {selectedObituary.publisher?.phone ||
                            selectedObituary.contributor?.phone}
                        </span>
                      </div>
                    )}
                    {(selectedObituary.publisher?.email ||
                      selectedObituary.contributor?.email) && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>
                          <strong>Email:</strong>{" "}
                          {selectedObituary.publisher?.email ||
                            selectedObituary.contributor?.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Information */}
              {selectedObituary.mpesaCode && (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Payment Information</h3>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <span>
                      <strong>M-Pesa Code:</strong> {selectedObituary.mpesaCode}
                    </span>
                  </div>
                </div>
              )}

              {/* Appreciation Message */}
              {selectedObituary.appreciationMessage && (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">
                    Appreciation Message
                  </h3>
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {selectedObituary.appreciationMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedObituary.status === "rejected" &&
                selectedObituary.rejectionReason && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-red-600">
                      Rejection Reason
                    </h3>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <p className="text-red-800">
                        {selectedObituary.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" asChild>
                  <a
                    href={`/obituaries/${selectedObituary._id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Public Page
                  </a>
                </Button>
                {selectedObituary.status === "pending" && (
                  <>
                    <Button
                      onClick={() => {
                        setDetailsModalOpen(false);
                        openApprovalModal(selectedObituary);
                      }}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setDetailsModalOpen(false);
                        openRejectionModal(selectedObituary);
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => setDetailsModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Confirmation Modal */}
      <Dialog open={approvalModalOpen} onOpenChange={setApprovalModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Obituary</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this obituary? It will be
              published and visible to the public on the memorial site.
            </DialogDescription>
          </DialogHeader>
          {selectedObituary && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold">
                  {selectedObituary.name || selectedObituary.fullName}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedObituary.dob || selectedObituary.dateOfBirth} —{" "}
                  {selectedObituary.dod || selectedObituary.dateOfDeath}
                </p>
                <p className="text-sm mt-2">
                  By: {selectedObituary.userId?.name || "Unknown"}
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setApprovalModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleApprove(selectedObituary._id)}
                  disabled={actionLoading === selectedObituary._id}
                >
                  {actionLoading === selectedObituary._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Approve & Publish
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog open={rejectionModalOpen} onOpenChange={setRejectionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Obituary</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this obituary. This will
              help the submitter understand what needs to be improved.
            </DialogDescription>
          </DialogHeader>
          {selectedObituary && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold">
                  {selectedObituary.name || selectedObituary.fullName}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedObituary.dob || selectedObituary.dateOfBirth} —{" "}
                  {selectedObituary.dod || selectedObituary.dateOfDeath}
                </p>
                <p className="text-sm mt-2">
                  By: {selectedObituary.userId?.name || "Unknown"}
                </p>
              </div>
              <div>
                <Label htmlFor="rejectionReason">Reason for Rejection *</Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please explain why this obituary cannot be approved..."
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setRejectionModalOpen(false);
                    setRejectionReason("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedObituary._id)}
                  disabled={
                    actionLoading === selectedObituary._id ||
                    !rejectionReason.trim()
                  }
                >
                  {actionLoading === selectedObituary._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <X className="w-4 h-4 mr-2" />
                  )}
                  Reject Obituary
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
