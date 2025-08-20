"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MemorialDetailModal } from "@/components/memorial-detail-modal"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Search, Heart, User, Calendar, MapPin, Eye } from "lucide-react"

interface Memorial {
  _id: string
  fullName: string
  dateOfBirth: string
  dateOfDeath: string
  placeOfBirth?: string
  placeOfDeath?: string
  biography?: string
  epitaph?: string
  portraitUrl?: string
  galleryImages: Array<{
    url: string
    caption?: string
  }>
  familyTree: Array<{
    name: string
    relationship: string
    dateOfBirth?: string
    dateOfDeath?: string
    isDeceased?: boolean
  }>
  memorialServices: Array<{
    type: string
    venue: string
    address?: string
    date: string
    time?: string
    description?: string
  }>
  burialServices: Array<{
    type: string
    venue: string
    address?: string
    date: string
    time?: string
    description?: string
  }>
  createdAt: string
  updatedAt: string
}

interface MemorialsResponse {
  success: boolean
  obituaries: Memorial[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function MemorialsPage() {
  const [memorials, setMemorials] = useState<Memorial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMemorial, setSelectedMemorial] = useState<Memorial | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  })

  const fetchMemorials = async (page = 1, search = "") => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      })

      if (search.trim()) {
        params.append("search", search.trim())
      }

      console.log("Fetching memorials with params:", params.toString())

      const response = await fetch(`/api/memorials?${params}`)
      const data: MemorialsResponse = await response.json()

      console.log("Memorials API response:", data)

      if (data.success) {
        setMemorials(data.obituaries || [])
        setPagination(data.pagination)
      } else {
        throw new Error("Failed to fetch memorials")
      }
    } catch (error) {
      console.error("Error fetching memorials:", error)
      setError("Failed to load memorials")
      setMemorials([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemorials(1, searchTerm)
  }, [searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchMemorials(1, searchTerm)
  }

  const handlePageChange = (newPage: number) => {
    fetchMemorials(newPage, searchTerm)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Unknown"
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return "Unknown"
    }
  }

  const getAge = (birthStr: string, deathStr: string) => {
    try {
      const birth = new Date(birthStr)
      const death = new Date(deathStr)

      if (isNaN(birth.getTime()) || isNaN(death.getTime())) return null

      let age = death.getFullYear() - birth.getFullYear()
      const monthDiff = death.getMonth() - birth.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
        age--
      }

      return age
    } catch (error) {
      return null
    }
  }

  if (loading) {
    return (
      <>
        <SiteHeader />
        <div className="min-h-screen bg-black">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">Memorial Gallery</h1>
              <p className="text-lg text-gray-300">Honoring lives, preserving memories</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse bg-gray-900 border-gray-800">
                  <div className="h-64 bg-gray-800"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-800 rounded mb-2"></div>
                    <div className="h-3 bg-gray-800 rounded mb-2"></div>
                    <div className="h-3 bg-gray-800 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <SiteFooter />
      </>
    )
  }

  if (error) {
    return (
      <>
        <SiteHeader />
        <div className="min-h-screen bg-black">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <Heart className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2 text-white">Unable to Load Memorials</h2>
              <p className="text-gray-300 mb-4">{error}</p>
              <Button
                onClick={() => fetchMemorials(1, searchTerm)}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Memorial Gallery</h1>
            <p className="text-lg text-gray-300 mb-6">Honoring lives, preserving memories</p>

            {/* Search */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search memorials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-gray-500"
                />
              </div>
            </form>
          </div>

          {/* Results Count */}
          {pagination.totalCount > 0 && (
            <div className="text-center mb-6">
              <p className="text-gray-300">
                {searchTerm
                  ? `Found ${pagination.totalCount} memorial${pagination.totalCount !== 1 ? "s" : ""} matching "${searchTerm}"`
                  : `${pagination.totalCount} memorial${pagination.totalCount !== 1 ? "s" : ""} available`}
              </p>
            </div>
          )}

          {/* Memorial Cards */}
          {memorials && memorials.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {memorials.map((memorial) => (
                  <Card
                    key={memorial._id}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-gray-900 border-gray-800 hover:border-gray-600"
                  >
                    <div className="relative h-64 bg-gray-800">
                      {memorial.portraitUrl ? (
                        <img
                          src={memorial.portraitUrl || "/placeholder.svg"}
                          alt={memorial.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="h-16 w-16 text-gray-500" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <Button
                          onClick={() => setSelectedMemorial(memorial)}
                          size="sm"
                          className="w-full bg-white/90 text-black hover:bg-white"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Leave Tribute
                        </Button>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold text-center text-white">{memorial.fullName}</CardTitle>
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {formatDate(memorial.dateOfBirth)} - {formatDate(memorial.dateOfDeath)}
                        </span>
                        {getAge(memorial.dateOfBirth, memorial.dateOfDeath) && (
                          <Badge variant="secondary" className="ml-2 text-xs bg-gray-700 text-gray-200">
                            Age {getAge(memorial.dateOfBirth, memorial.dateOfDeath)}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {memorial.epitaph && (
                        <blockquote className="text-sm italic text-center text-gray-300 mb-3 border-l-2 border-gray-600 pl-3">
                          "{memorial.epitaph}"
                        </blockquote>
                      )}

                      {memorial.biography && (
                        <p className="text-sm text-gray-400 mb-4 line-clamp-3">{memorial.biography}</p>
                      )}

                      {memorial.memorialServices && memorial.memorialServices.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{memorial.memorialServices[0].venue}</span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedMemorial(memorial)}
                          className="flex-1 border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setSelectedMemorial(memorial)}
                          className="flex-1 bg-white text-black hover:bg-gray-200"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Tribute
                        </Button>
                      </div>

                      <div className="text-xs text-gray-500 text-center mt-3 pt-3 border-t border-gray-800">
                        Published {formatDate(memorial.createdAt)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    size="sm"
                    className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white disabled:opacity-50"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i
                      } else {
                        pageNum = pagination.currentPage - 2 + i
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === pagination.currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 ${
                            pageNum === pagination.currentPage
                              ? "bg-white text-black hover:bg-gray-200"
                              : "border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white"
                          }`}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    size="sm"
                    className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2 text-white">No Memorials Found</h2>
              <p className="text-gray-300">
                {searchTerm
                  ? `No memorials match your search for "${searchTerm}"`
                  : "No memorials have been published yet."}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    fetchMemorials(1, "")
                  }}
                  className="mt-4 border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white"
                >
                  View All Memorials
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Memorial Detail Modal */}
      {selectedMemorial && (
        <MemorialDetailModal
          memorial={selectedMemorial}
          isOpen={!!selectedMemorial}
          onClose={() => setSelectedMemorial(null)}
        />
      )}
      <SiteFooter />
    </>
  )
}
