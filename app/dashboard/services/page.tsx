import { cookies } from "next/headers";
import { requireAuthUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import Service from "@/models/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Building2, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

const CATEGORIES = [
  "Funeral Homes",
  "Caskets",
  "Flowers",
  "Streaming",
  "Transport",
  "Catering",
];

export default async function UserServicesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const cookieStore = await cookies();
  const user = await requireAuthUser(cookieStore);
  await getDb();

  const filter: any = { status: "published" };
  if (searchParams.category) filter.category = searchParams.category;
  const services = await Service.find(filter).sort({ createdAt: -1 }).lean();

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
              <BreadcrumbPage>Services</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Funeral Service Directory</h1>
            <p className="text-muted-foreground">
              Find trusted funeral service providers for your needs
            </p>
          </div>
          <Link href="/services/submit">
            <Button variant="outline">
              <Building2 className="w-4 h-4 mr-2" />
              Submit Your Service
            </Button>
          </Link>
        </div>

        {/* Category Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Browse by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Link href="/dashboard/services">
                <Button
                  variant={!searchParams.category ? "default" : "outline"}
                  size="sm"
                >
                  All Services ({services.length})
                </Button>
              </Link>
              {CATEGORIES.map((category) => {
                const count = services.filter(
                  (s) => s.category === category
                ).length;
                return (
                  <Link
                    key={category}
                    href={`/dashboard/services?category=${encodeURIComponent(
                      category
                    )}`}
                  >
                    <Button
                      variant={
                        searchParams.category === category
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                    >
                      {category} ({count})
                    </Button>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        {services.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Building2 className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchParams.category
                  ? `No ${searchParams.category.toLowerCase()} services found`
                  : "No services available"}
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {searchParams.category
                  ? `There are currently no verified ${searchParams.category.toLowerCase()} service providers. Try browsing other categories.`
                  : "Service providers will appear here once they are verified by our team."}
              </p>
              {searchParams.category && (
                <Link href="/dashboard/services">
                  <Button>View All Services</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service: any) => (
              <Card
                key={service._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Logo and Header */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {service.logo?.url ? (
                          <img
                            src={service.logo.url || "/placeholder.svg"}
                            alt={`${service.businessName} logo`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Building2 className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg leading-tight">
                          {service.businessName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {service.category}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {service.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {service.description}
                      </p>
                    )}

                    {/* Contact Information */}
                    {service.contact && (
                      <div className="space-y-2">
                        {service.contact.name && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 flex items-center justify-center">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            </div>
                            <span className="font-medium">
                              {service.contact.name}
                            </span>
                          </div>
                        )}
                        {service.contact.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <a
                              href={`tel:${service.contact.phone}`}
                              className="hover:text-primary transition-colors"
                            >
                              {service.contact.phone}
                            </a>
                          </div>
                        )}
                        {service.contact.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <a
                              href={`mailto:${service.contact.email}`}
                              className="hover:text-primary transition-colors truncate"
                            >
                              {service.contact.email}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* M-Pesa Code */}
                    {service.mpesaCode && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          M-Pesa Paybill
                        </div>
                        <div className="font-mono text-sm">
                          {service.mpesaCode}
                        </div>
                      </div>
                    )}

                    {/* Verification Badge */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">
                          Verified Provider
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Listed{" "}
                        {new Date(service.createdAt).toLocaleDateString()}
                      </div>
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
            <CardTitle className="text-lg">
              About Our Service Directory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              All service providers listed here have been verified by our team.
              We ensure they meet our standards for quality and reliability.
            </p>
            <p>
              <strong>Need to add your service?</strong> Submit your business
              for review and reach families who need your services during
              difficult times.
            </p>
            <div className="pt-2">
              <Link href="/services/submit">
                <Button size="sm">
                  <Building2 className="w-3 h-3 mr-1" />
                  Submit Your Service
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
