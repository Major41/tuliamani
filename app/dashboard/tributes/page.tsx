"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { MessageSquare, Heart, Calendar, User, Phone, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TributeData {
  tributes: any[]
  tributesByObituary: { [key: string]: { obituary: any; tributes: any[] } }
  stats: {
    totalTributes: number
    obituariesWithTributes: number
    thisMonth: number
    thisWeek: number
  }
}

export default function UserTributesPage() {
  const [user, setUser] = useState<any>(null)
  const [tributeData, setTributeData] = useState<TributeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchTributeData()
  }, [])

  const fetchTributeData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get user info
      const userRes = await fetch("/api/auth/me")
      const userData = await userRes.json()

      if (!userData.user) {
        router.push("/login")
        return
      }

      setUser(userData.user)
      console.log(userData.user)

      // Get user's tributes
      const tributesRes = await fetch(`/api/tributes?userId=${userData.user._id}`)
      const tributesResult = await tributesRes.json()

      if (!tributesResult.success) {
        throw new Error(tributesResult.error || "Failed to fetch tributes")
      }

      const tributes = tributesResult.tributes || []

      // Get user's obituaries for grouping
      const obituariesRes = await fetch("/api/obituaries?mine=true")
      const obituariesResult = await obituariesRes.json()
      const obituaries = obituariesResult.obituaries || []

      // Create obituary map
      const obituaryMap = obituaries.reduce((acc: any, obit: any) => {
        acc[obit._id] = obit
        return acc
      }, {})

      // Group tributes by obituary
      const tributesByObituary = tributes.reduce((acc: any, tribute: any) => {
        const obituaryId = tribute.tributeId._id || tribute.tributeId
        const obituary = obituaryMap[obituaryId]

        if (!obituary) return acc

        if (!acc[obituaryId]) {
          acc[obituaryId] = {
            obituary,
            tributes: [],
          }
        }
        acc[obituaryId].tributes.push(tribute)
        return acc
      }, {})

      // Calculate stats
      const now = new Date()
      const thisMonth = tributes.filter((t: any) => {
        const tributeDate = new Date(t.createdAt)
        return tributeDate.getMonth() === now.getMonth() && tributeDate.getFullYear() === now.getFullYear()
      })

      const thisWeek = tributes.filter((t: any) => {
        const tributeDate = new Date(t.createdAt)
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return tributeDate >= weekAgo
      })

      const stats = {
        totalTributes: tributes.length,
        obituariesWithTributes: Object.keys(tributesByObituary).length,
        thisMonth: thisMonth.length,
        thisWeek: thisWeek.length,
      }

      setTributeData({
        tributes,
        tributesByObituary,
        stats,
      })
    } catch (error) {
      console.error("Failed to fetch tribute data:", error)
      setError(error instanceof Error ? error.message : "Failed to load tributes")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading tributes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Tributes</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchTributeData}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!user || !tributeData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4">Please log in to view your tributes.</p>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { tributes, tributesByObituary, stats } = tributeData

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
                <BreadcrumbPage>Tributes Received</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tributes Received</h1>
              <p className="text-muted-foreground">Condolence messages and tributes from friends and family</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tributes</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTributes}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Obituaries with Tributes</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.obituariesWithTributes}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.thisMonth}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.thisWeek}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tributes by Obituary */}
          {Object.keys(tributesByObituary).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tributes received yet</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  When people leave condolence messages on your obituaries, they will appear here. Share your obituaries
                  to receive heartfelt tributes from friends and family.
                </p>
                <Link href="/dashboard/obituaries">
                  <Button>View My Obituaries</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.values(tributesByObituary).map((group: any) => (
                <Card key={group.obituary._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            group.obituary.images?.find((i: any) => i.type === "portrait")?.url ||
                            "/placeholder.svg?height=60&width=60&query=portrait"
                          }
                          alt="Portrait"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <CardTitle className="text-lg">{group.obituary.name}</CardTitle>
                          <CardDescription>
                            {group.obituary.dob} — {group.obituary.dod} • {group.tributes.length} tribute
                            {group.tributes.length !== 1 ? "s" : ""}
                          </CardDescription>
                        </div>
                      </div>
                      <Link href={`/obituaries/${group.obituary._id}`}>
                        <Button variant="outline" size="sm">
                          View Obituary
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {group.tributes.map((tribute: any) => (
                        <div key={tribute._id} className="border rounded-lg p-4 bg-muted/30">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{tribute.name}</div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                  {tribute.relationship && <span>{tribute.relationship}</span>}
                                  {tribute.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      <span>{tribute.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(tribute.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed pl-11">{tribute.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Summary Card */}
          {tributes.length > 0 && (
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">Tribute Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <strong>Most Active Obituary:</strong>{" "}
                    {Object.values(tributesByObituary).reduce((max: any, current: any) =>
                      current.tributes.length > (max?.tributes?.length || 0) ? current : max,
                    )?.obituary?.name || "N/A"}
                  </div>
                  <div>
                    <strong>Latest Tribute:</strong>{" "}
                    {tributes.length > 0 ? new Date(tributes[0].createdAt).toLocaleDateString() : "N/A"}
                  </div>
                </div>
                <div className="text-muted-foreground">
                  These heartfelt messages show how much your loved ones meant to others. Each tribute helps preserve
                  their memory and brings comfort during difficult times.
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
