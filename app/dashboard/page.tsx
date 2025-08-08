"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { AppSidebar } from "@/components/app-sidebar"
import { ObituaryViewModal } from "@/components/obituary-view-modal"
import { ObituaryEditModal } from "@/components/obituary-edit-modal"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Heart, Plus, BookOpen, Clock, Download, TrendingUp, MessageSquare, Calendar, Eye, Edit } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [obituaries, setObituaries] = useState<any[]>([])
  const [tributesReceived, setTributesReceived] = useState<any[]>([])
  const [legacyOrders, setLegacyOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedObituary, setSelectedObituary] = useState<any>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Get user info
      const userRes = await fetch('/api/auth/me')
      const userData = await userRes.json()
      setUser(userData.user)

      if (userData.user) {
        // Get user's obituaries
        const obituariesRes = await fetch('/api/obituaries?mine=true')
        const obituariesData = await obituariesRes.json()
        setObituaries(obituariesData.obituaries || [])

        // Get tributes received
        const tributesRes = await fetch(`/api/tributes?userId=${userData.user._id}`)
        const tributesData = await tributesRes.json()
        setTributesReceived(tributesData.tributes || [])

        // Get legacy orders
        const ordersRes = await fetch('/api/legacy-orders')
        const ordersData = await ordersRes.json()
        setLegacyOrders(ordersData.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewObituary = (obituary: any) => {
    setSelectedObituary(obituary)
    setViewModalOpen(true)
  }

  const handleEditObituary = (obituary: any) => {
    setSelectedObituary(obituary)
    setEditModalOpen(true)
  }

  const handleObituaryUpdate = () => {
    fetchDashboardData() // Refresh data after update
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4">Please log in to access your dashboard.</p>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  const stats = {
    totalObituaries: obituaries.length,
    publishedObituaries: obituaries.filter(t => t.status === 'published').length,
    memorializedObituaries: obituaries.filter(t => t.status === 'memorialized').length,
    pendingObituaries: obituaries.filter(t => t.status === 'pending').length,
    totalTributesReceived: tributesReceived.length,
    legacyOrders: legacyOrders.length,
    completedLegacyOrders: legacyOrders.filter(o => o.status === 'completed').length,
  }

  // Get recent activity (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentTributes = tributesReceived.filter(t => new Date(t.createdAt) > thirtyDaysAgo)

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
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 space-y-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
              <p className="text-muted-foreground">
                Manage your obituaries and preserve precious memories
              </p>
            </div>
            <Link href="/obituaries/new">
              <Button size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Create New Obituary
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Obituaries</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalObituaries}</div>
                <p className="text-xs text-muted-foreground">
                  All your created obituaries
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.publishedObituaries}</div>
                <p className="text-xs text-muted-foreground">
                  Live obituaries
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memorialized</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.memorializedObituaries}</div>
                <p className="text-xs text-muted-foreground">
                  Archived memorials
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingObituaries}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tributes</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTributesReceived}</div>
                <p className="text-xs text-muted-foreground">
                  Total received
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          {recentTributes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Tributes received in the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTributes.slice(0, 5).map((tribute: any) => (
                    <div key={tribute._id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/30">
                      <MessageSquare className="w-4 h-4 text-muted-foreground mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{tribute.authorName}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(tribute.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          Left a tribute: "{tribute.message.substring(0, 100)}..."
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Link href="/dashboard/tributes">
                      <Button variant="outline" size="sm">View All Tributes</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Obituaries */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Obituaries</CardTitle>
                  <CardDescription>
                    {stats.totalObituaries > 0 
                      ? `Manage and view your ${stats.totalObituaries} obituar${stats.totalObituaries === 1 ? 'y' : 'ies'}`
                      : 'Create your first obituary to get started'
                    }
                  </CardDescription>
                </div>
                <Link href="/dashboard/obituaries">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {obituaries.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No obituaries yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first obituary to honor a loved one
                  </p>
                  <Link href="/obituaries/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Obituary
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {obituaries.slice(0, 6).map((obituary: any) => (
                    <Card key={obituary._id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          alt="Portrait"
                          className="w-full h-full object-cover"
                          src={obituary.images?.find((i:any)=>i.type==='portrait')?.url || "/placeholder.svg?height=200&width=300&query=portrait+memorial+placeholder"}
                        />
                        <div className="absolute top-2 right-2">
                          <StatusBadge status={obituary.status} />
                        </div>
                        {obituary.paid && (
                          <div className="absolute top-2 left-2">
                            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Paid
                            </div>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{obituary.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {obituary.dob} — {obituary.dod}
                        </p>
                        <div className="text-xs text-muted-foreground mb-3">
                          Created {new Date(obituary.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewObituary(obituary)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditObituary(obituary)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          {(obituary.status === 'memorialized' || obituary.status === 'published') && (
                            <Link href={`/api/tributes/${obituary._id}/download`}>
                              <Button variant="outline" size="sm">
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
            </CardContent>
          </Card>

          {/* Legacy Books Summary */}
          {legacyOrders.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Legacy Books
                    </CardTitle>
                    <CardDescription>
                      {stats.legacyOrders} order{stats.legacyOrders !== 1 ? 's' : ''}, {stats.completedLegacyOrders} completed
                    </CardDescription>
                  </div>
                  <Link href="/dashboard/legacy-books">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {legacyOrders.slice(0, 4).map((order: any) => (
                    <div key={order._id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <BookOpen className="w-8 h-8 text-primary" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{order.deceasedName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.packageType === 'design' ? 'Design Only' : 'Full Curation'}
                        </div>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Legacy Book
                </CardTitle>
                <CardDescription>
                  Order a curated legacy book to preserve memories in print
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/legacy-book">
                  <Button className="w-full">Order Now</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  View Tributes
                </CardTitle>
                <CardDescription>
                  See all condolence messages received on your obituaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/tributes">
                  <Button variant="outline" className="w-full">
                    View {stats.totalTributesReceived} Tribute{stats.totalTributesReceived !== 1 ? 's' : ''}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Create Memorial
                </CardTitle>
                <CardDescription>
                  Honor another loved one with a new obituary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/obituaries/new">
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>

      {/* Modals */}
      <ObituaryViewModal
        obituary={selectedObituary}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
      />
      <ObituaryEditModal
        obituary={selectedObituary}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onUpdate={handleObituaryUpdate}
      />
    </SidebarProvider>
  )
}
