"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  Users,
  Settings,
  BookOpen,
  Building2,
  FileText,
  LogOut,
  Plus,
  Download,
  Clock,
  Shield,
  MessageSquare,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: { name: string; email: string; role: string };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = user?.role === "admin";

  const userNavItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Obituaries",
      url: "/dashboard/obituaries",
      icon: Heart,
    },
    {
      title: "Tributes Received",
      url: "/dashboard/tributes",
      icon: MessageSquare,
    },
    {
      title: "Legacy Books",
      url: "/dashboard/legacy-books",
      icon: BookOpen,
    },
  ];

  const adminNavItems = [
    {
      title: "Admin Dashboard",
      url: "/admin",
      icon: Shield,
    },
    {
      title: "All Obituaries",
      url: "/admin/obituaries",
      icon: Heart,
    },
    {
      title: "All Tributes",
      url: "/admin/tributes",
      icon: Heart,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Services",
      url: "/admin/services",
      icon: Building2,
    },
    {
      title: "Legacy Orders",
      url: "/admin/legacy-orders",
      icon: BookOpen,
    },
    {
      title: "Blog Posts",
      url: "/admin/blog",
      icon: FileText,
    },
  ];

  const publicItems = [
    {
      title: "Services",
      url: "/dashboard/services",
      icon: Building2,
    },
    {
      title: "Blog",
      url: "/dashboard/blog",
      icon: FileText,
    },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        toast({
          title: "Logged out successfully",
          description: "You have been signed out of your account.",
        });
        router.push("/");
        router.refresh();
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Tuliamani</span>
          </Link>
        </div>
        {user && (
          <div className="px-2 py-2 text-sm">
            <div className="font-medium">{user.name}</div>
            <div className="text-muted-foreground text-xs">{user.email}</div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {user && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/obituaries/new">
                        <Plus className="w-4 h-4" />
                        <span>Create Obituary</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>
                {isAdmin ? "Admin" : "Dashboard"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {(isAdmin ? adminNavItems : userNavItems).map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                      >
                        <Link href={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Explore</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {publicItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {user ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="w-full">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <div className="space-y-2 p-2">
            <Link href="/login" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button size="sm" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
