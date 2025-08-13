"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Heart, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface MemorialDetailModalProps {
  obituary: any;
  tributes: any[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTributeSubmitted: () => void;
}

export function MemorialDetailModal({
  obituary,
  tributes,
  open,
  onOpenChange,
  onTributeSubmitted,
}: MemorialDetailModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    relationship: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.message.trim()) {
      toast.error("Please fill in your name and tribute message");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/tributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          obituaryId: obituary._id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Your tribute has been submitted successfully");
        setFormData({ name: "", phone: "", relationship: "", message: "" });
        onTributeSubmitted();
      } else {
        toast.error(data.error || "Failed to submit tribute");
      }
    } catch (error) {
      console.error("Failed to submit tribute:", error);
      toast.error("Failed to submit tribute");
    } finally {
      setSubmitting(false);
    }
  };

  if (!obituary) return null;

  const portrait = obituary.images?.find((img: any) => img.type === "portrait");
  const galleryImages =
    obituary.images?.filter((img: any) => img.type === "gallery") || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Memorial for {obituary.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* Portrait and Basic Info */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img
                  src={
                    portrait?.url ||
                    "/placeholder.svg?height=400&width=300&query=memorial+portrait"
                  }
                  alt={obituary.name}
                  className="w-full aspect-[3/4] object-cover rounded-lg"
                />
              </div>

              <div className="md:w-2/3 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold">{obituary.name}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {obituary.dob} - {obituary.dod}
                    </span>
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    {obituary.status === "published" ? "Published" : "Approved"}
                  </Badge>
                </div>

                {obituary.epitaph && (
                  <blockquote className="text-lg italic border-l-4 border-primary pl-4">
                    "{obituary.epitaph}"
                  </blockquote>
                )}

                {/* Funeral Information */}
                {obituary.funeralInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Funeral Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {obituary.funeralInfo.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{obituary.funeralInfo.venue}</span>
                        </div>
                      )}
                      {obituary.funeralInfo.time && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{obituary.funeralInfo.time}</span>
                        </div>
                      )}
                      {obituary.funeralInfo.streamingLink && (
                        <div className="mt-2">
                          <a
                            href={obituary.funeralInfo.streamingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Join Live Stream
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Life Story */}
            <Card>
              <CardHeader>
                <CardTitle>Life Story</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {obituary.eulogy
                    .split("\n")
                    .map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photo Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((image: any, index: number) => (
                      <img
                        key={index}
                        src={image.url || "/placeholder.svg"}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Existing Tributes */}
            {tributes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Tributes ({tributes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tributes.map((tribute: any) => (
                      <div
                        key={tribute._id}
                        className="border-l-2 border-primary/20 pl-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{tribute.name}</span>
                            {tribute.relationship && (
                              <Badge variant="outline" className="text-xs">
                                {tribute.relationship}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(tribute.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-2 text-sm">{tribute.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tribute Form */}
            {obituary.allowPublicTributes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Leave a Tribute
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="relationship">
                        Relationship to {obituary.name}
                      </Label>
                      <Input
                        id="relationship"
                        value={formData.relationship}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            relationship: e.target.value,
                          })
                        }
                        placeholder="e.g., Friend, Colleague, Neighbor"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Tribute Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Share your memories, condolences, or thoughts about this person..."
                        rows={4}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full"
                    >
                      {submitting ? "Submitting..." : "Submit Tribute"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
