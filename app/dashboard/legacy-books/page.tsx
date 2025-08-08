import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAuthUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import LegacyOrder from "@/models/legacy-order";
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
  Plus,
  Download,
  Clock,
  CheckCircle,
  Package,
} from "lucide-react";

export default async function UserLegacyBooksPage() {
  const cookieStore = await cookies();
  const user = await requireAuthUser(cookieStore);
  await getDb();
  const orders = await LegacyOrder.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .lean();

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
                <BreadcrumbPage>Legacy Books</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Legacy Books</h1>
              <p className="text-muted-foreground">
                Order and manage your legacy book projects
              </p>
            </div>
            <Link href="/legacy-book">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Order New Book
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter((o) => o.status === "pending").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter((o) => o.status === "assigned").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter((o) => o.status === "completed").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No legacy books ordered yet
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Create beautiful printed books to preserve memories forever.
                  Choose from design-only or full curation packages.
                </p>
                <Link href="/legacy-book">
                  <Button size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Order Your First Book
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <Card
                  key={order._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg">
                              {order.deceasedName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Requested by {order.requesterName}
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
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
                        </div>

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
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <StatusBadge status={order.status} />
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Information Card */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">About Legacy Books</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Design Only Package (KES 50,000):</strong> We create a
                beautiful book design using the content you provide.
              </div>
              <div>
                <strong>Full Curation Package (KES 100,000):</strong> We handle
                everything - content curation, interviews, writing, and design.
              </div>
              <div className="text-muted-foreground">
                All books are professionally printed and bound. Delivery takes
                2-4 weeks after completion.
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
