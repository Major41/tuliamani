import { cookies } from "next/headers";
import { requireRoleUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import Tribute from "@/models/tribute";
import Service from "@/models/service";
import LegacyOrder from "@/models/legacy-order";
import User from "@/models/user";
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
  Users,
  Building2,
  BookOpen,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
} from "lucide-react";

async function approveTributeAction(id: string) {
  "use server";
  const { isAdmin } = await requireRoleUser(await cookies(), ["admin"]);
  if (!isAdmin) throw new Error("Forbidden");
  await getDb();
  await Tribute.findByIdAndUpdate(id, {
    status: "published",
    publishedAt: new Date(),
  });
}

async function markPaidAction(id: string, paid: boolean) {
  "use server";
  const { isAdmin } = await requireRoleUser(await cookies(), ["admin"]);
  if (!isAdmin) throw new Error("Forbidden");
  await getDb();
  await Tribute.findByIdAndUpdate(id, { paid });
}

export default async function AdminPage() {
  const { user, isAdmin } = await requireRoleUser(await cookies(), ["admin"]);
  if (!isAdmin) return <main className="p-6">Forbidden</main>;

  await getDb();
  const [tributes, services, orders, users] = await Promise.all([
    Tribute.find({}).sort({ createdAt: -1 }).limit(50).lean(),
    Service.find({}).sort({ createdAt: -1 }).limit(20).lean(),
    LegacyOrder.find({}).sort({ createdAt: -1 }).limit(20).lean(),
    User.find({}).sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  const stats = {
    totalTributes: tributes.length,
    pendingTributes: tributes.filter((t) => t.status === "pending").length,
    totalUsers: users.length,
    totalServices: services.length,
    pendingServices: services.filter((s) => s.status === "pending").length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
  };

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
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage tributes, users, and platform operations
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tributes
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTributes}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingTributes} pending approval
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Services</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalServices}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingServices} pending approval
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
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingOrders} pending
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tributes */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tributes</CardTitle>
              <CardDescription>
                Latest tribute submissions requiring review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">User</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Paid</th>
                      <th className="text-left p-3 font-medium">Mpesa</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tributes.slice(0, 10).map((t: any) => (
                      <tr key={t._id} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{t.name}</td>
                        <td className="p-3 text-muted-foreground truncate max-w-32">
                          {String(t.userId)}
                        </td>
                        <td className="p-3">
                          <StatusBadge status={t.status} />
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              t.paid
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {t.paid ? "Paid" : "Unpaid"}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {t.mpesaCode || "-"}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <form
                              action={approveTributeAction.bind(
                                null,
                                String(t._id)
                              )}
                            >
                              <Button size="sm" variant="outline">
                                Approve
                              </Button>
                            </form>
                            <form
                              action={markPaidAction.bind(
                                null,
                                String(t._id),
                                !t.paid
                              )}
                            >
                              <Button size="sm" variant="outline">
                                {t.paid ? "Mark Unpaid" : "Mark Paid"}
                              </Button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {tributes.length === 0 && (
                      <tr>
                        <td
                          className="p-6 text-center text-muted-foreground"
                          colSpan={6}
                        >
                          No tributes found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Services and Orders */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Funeral Services
                </CardTitle>
                <CardDescription>Recent service submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {services.slice(0, 5).map((s: any) => (
                    <div
                      key={s._id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {s.businessName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {s.category}
                        </div>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                  ))}
                  {services.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      No service submissions
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Legacy Book Orders
                </CardTitle>
                <CardDescription>Recent book orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((o: any) => (
                    <div
                      key={o._id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {o.deceasedName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {o.packageType === "design"
                            ? "Design Only"
                            : "Full Curation"}
                        </div>
                      </div>
                      <StatusBadge status={o.status} />
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      No legacy book orders
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
