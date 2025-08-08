"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import {
  Calendar,
  MapPin,
  ExternalLink,
  User,
  Phone,
  Mail,
  Heart,
  Download,
} from "lucide-react";
import Link from "next/link";

interface ObituaryViewModalProps {
  obituary: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ObituaryViewModal({
  obituary,
  open,
  onOpenChange,
}: ObituaryViewModalProps) {
  if (!obituary) return null;

  const portrait = obituary.images?.find((i: any) => i.type === "portrait");
  const galleryImages =
    obituary.images?.filter((i: any) => i.type === "gallery") || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Obituary Details</span>
            <div className="flex items-center gap-2">
              <StatusBadge status={obituary.status} />
              {obituary.paid && (
                <Badge className="bg-green-100 text-green-800">Paid</Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 h-64 relative">
              <img
                src={
                  portrait?.url ||
                  "/placeholder.svg?height=280&width=280&query=memorial+portrait"
                }
                alt="Portrait"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-3xl font-bold">{obituary.name}</h2>
                <p className="text-lg text-muted-foreground">
                  {obituary.dob} — {obituary.dod}
                </p>
                {obituary.epitaph && (
                  <blockquote className="text-lg italic border-l-4 border-primary pl-4 mt-3">
                    "{obituary.epitaph}"
                  </blockquote>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <StatusBadge status={obituary.status} />
                </div>
                <div>
                  <span className="font-medium">Payment:</span>{" "}
                  <Badge variant={obituary.paid ? "default" : "secondary"}>
                    {obituary.paid ? "Paid" : "Unpaid"}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(obituary.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Public Tributes:</span>{" "}
                  {obituary.allowPublicTributes ? "Allowed" : "Disabled"}
                </div>
              </div>
            </div>
          </div>

          {/* Eulogy */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Life Story</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
              {obituary.eulogy}
            </div>
          </div>

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Photo Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map((img: any, idx: number) => (
                  <img
                    key={idx}
                    src={img.url || "/placeholder.svg"}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Funeral Information */}
          {obituary.funeralInfo &&
            (obituary.funeralInfo.venue || obituary.funeralInfo.time) && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Funeral Information</h3>
                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  {obituary.funeralInfo.venue && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>
                        <strong>Venue:</strong> {obituary.funeralInfo.venue}
                      </span>
                    </div>
                  )}
                  {obituary.funeralInfo.time && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>
                        <strong>Date & Time:</strong>{" "}
                        {obituary.funeralInfo.time}
                      </span>
                    </div>
                  )}
                  {obituary.funeralInfo.streamingLink && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      <span>
                        <strong>Live Stream:</strong>
                      </span>
                      <a
                        href={obituary.funeralInfo.streamingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Watch Online
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Contributor Information */}
          {obituary.contributor &&
            (obituary.contributor.name ||
              obituary.contributor.phone ||
              obituary.contributor.email) && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">
                  Contributor Information
                </h3>
                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  {obituary.contributor.name && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>
                        <strong>Name:</strong> {obituary.contributor.name}
                      </span>
                    </div>
                  )}
                  {obituary.contributor.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>
                        <strong>Phone:</strong> {obituary.contributor.phone}
                      </span>
                    </div>
                  )}
                  {obituary.contributor.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>
                        <strong>Email:</strong> {obituary.contributor.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Payment Information */}
          {obituary.mpesaCode && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Payment Information</h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <span>
                  <strong>M-Pesa Code:</strong> {obituary.mpesaCode}
                </span>
              </div>
            </div>
          )}

          {/* Appreciation Message */}
          {obituary.appreciationMessage && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Appreciation Message</h3>
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">
                  {obituary.appreciationMessage}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Link href={`/obituaries/${obituary._id}`} target="_blank">
              <Button>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Public Page
              </Button>
            </Link>
            {(obituary.status === "memorialized" ||
              obituary.status === "published") && (
              <Link href={`/api/tributes/${obituary._id}/download`}>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download ZIP
                </Button>
              </Link>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
