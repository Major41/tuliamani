"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MemorialDetailModal } from "@/components/memorial-detail-modal";
import { Heart, MapPin, Users, Eye } from "lucide-react";

export default function MemorialsPage() {
  const [tributes, setTributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedObituary, setSelectedObituary] = useState<any>(null);
  const [obituaryTributes, setObituaryTributes] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTributes();
  }, [page]);

  const fetchTributes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/memorials?page=${page}&limit=12`);
      const data = await response.json();

      if (data.success) {
        setTributes(data.tributes || []);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error("Failed to fetch tributes:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch tributes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (obituary: any) => {
    try {
      // Fetch tributes for this obituary
      const response = await fetch(`/api/tributes?obituaryId=${obituary._id}`);
      const data = await response.json();

      setSelectedObituary(obituary);
      setObituaryTributes(data.tributes || []);
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch obituary tributes:", error);
      setSelectedObituary(obituary);
      setObituaryTributes([]);
      setModalOpen(true);
    }
  };

  const handleTributeSubmitted = () => {
    // Refresh tributes for the current obituary
    if (selectedObituary) {
      handleViewDetails(selectedObituary);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading memorials...</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Memorial Gallery
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Honor the memories of loved ones and celebrate the lives that
              touched our hearts
            </p>
          </div>
        </section>

        {/* Memorials Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {tributes.length > 0 ? (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tributes.map((tribute: any) => {
                    const portrait = tribute.images?.find(
                      (img: any) => img.type === "portrait"
                    );

                    return (
                      <Card
                        key={tribute._id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-[4/3] relative overflow-hidden">
                          <img
                            src={
                              portrait?.url ||
                              "/placeholder.svg?height=300&width=400&query=memorial+portrait"
                            }
                            alt={tribute.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h3 className="font-semibold text-lg mb-1">
                              {tribute.name}
                            </h3>
                            <p className="text-sm opacity-90">
                              {tribute.dob && tribute.dod
                                ? `${tribute.dob} - ${tribute.dod}`
                                : "Dates not specified"}
                            </p>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          {tribute.epitaph && (
                            <blockquote className="text-sm italic text-muted-foreground mb-3 line-clamp-2">
                              "{tribute.epitaph}"
                            </blockquote>
                          )}

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {tribute.funeralInfo?.venue && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate max-w-20">
                                    {tribute.funeralInfo.venue}
                                  </span>
                                </div>
                              )}
                              {tribute.allowPublicTributes && (
                                <div className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  <span>Tributes</span>
                                </div>
                              )}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {tribute.status === "published"
                                ? "Published"
                                : "Approved"}
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              size="sm"
                              onClick={() => handleViewDetails(tribute)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Details
                            </Button>
                            
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Memorials Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to create a memorial for your loved one
                </p>
                <Link href="/signup">
                  <Button>Create Memorial</Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Memorial Detail Modal */}
      <MemorialDetailModal
        obituary={selectedObituary}
        tributes={obituaryTributes}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onTributeSubmitted={handleTributeSubmitted}
      />
    </div>
  );
}
