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
import Tribute from "@/models/tribute";
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
  Heart,
  Plus,
  Download,
  Edit,
  Eye,
  Calendar,
  MapPin,
} from "lucide-react";

export default async function UserObituariesPage() {
  const cookieStore = await cookies();
  const user = await requireAuthUser(cookieStore);
  await getDb();
  const obituaries = await Tribute.find({ userId: user._id })
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
                <BreadcrumbPage>My Obituaries</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Obituaries</h1>
              <p className="text-muted-foreground">
                Manage all your created obituaries and memorials
              </p>
            </div>
            <Link href="/obituaries/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Obituary
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{obituaries.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {obituaries.filter((o) => o.status === "published").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Memorialized
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {obituaries.filter((o) => o.status === "memorialized").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {obituaries.filter((o) => o.status === "pending").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Obituaries Grid */}
          {obituaries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Heart className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No obituaries yet
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Create your first obituary to honor a loved one and preserve
                  their memory for generations to come.
                </p>
                <Link href="/obituaries/new">
                  <Button size="lg">
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
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video relative">
                    <img
                      alt="Portrait"
                      className="w-full h-full object-cover"
                      src={
                        obituary.images?.find((i: any) => i.type === "portrait")
                          ?.url ||
                        "/placeholder.svg?height=200&width=300&query=portrait+memorial"
                      }
                    />
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={obituary.status} />
                    </div>
                    {obituary.paid && (
                      <div className="absolute top-3 left-3">
                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Paid
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg leading-tight">
                          {obituary.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {obituary.dob} — {obituary.dod}
                        </p>
                      </div>

                      {obituary.funeralInfo?.venue && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">
                            {obituary.funeralInfo.venue}
                          </span>
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        <Link href={`/obituaries/${obituary._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/obituaries/new?edit=${obituary._id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        {(obituary.status === "memorialized" ||
                          obituary.status === "published") && (
                          <Link href={`/api/tributes/${obituary._id}/download`}>
                            <Button variant="outline" size="sm">
                              <Download className="w-3 h-3 mr-1" />
                              ZIP
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
