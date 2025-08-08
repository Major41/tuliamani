"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, X } from "lucide-react";

interface ObituaryEditModalProps {
  obituary: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function ObituaryEditModal({
  obituary,
  open,
  onOpenChange,
  onUpdate,
}: ObituaryEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    dod: "",
    epitaph: "",
    eulogy: "",
    venue: "",
    time: "",
    streamingLink: "",
    contribName: "",
    contribPhone: "",
    contribEmail: "",
    allowPublicTributes: true,
  });
  const [portrait, setPortrait] = useState<any>(null);
  const [gallery, setGallery] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (obituary && open) {
      setFormData({
        name: obituary.name || "",
        dob: obituary.dob || "",
        dod: obituary.dod || "",
        epitaph: obituary.epitaph || "",
        eulogy: obituary.eulogy || "",
        venue: obituary.funeralInfo?.venue || "",
        time: obituary.funeralInfo?.time || "",
        streamingLink: obituary.funeralInfo?.streamingLink || "",
        contribName: obituary.contributor?.name || "",
        contribPhone: obituary.contributor?.phone || "",
        contribEmail: obituary.contributor?.email || "",
        allowPublicTributes: obituary.allowPublicTributes ?? true,
      });

      const portraitImg = obituary.images?.find(
        (i: any) => i.type === "portrait"
      );
      const galleryImgs =
        obituary.images?.filter((i: any) => i.type === "gallery") || [];

      setPortrait(portraitImg || null);
      setGallery(galleryImgs);
    }
  }, [obituary, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = async (file: File, type: "portrait" | "gallery") => {
    setUploading(true);
    try {
      const signRes = await fetch("/api/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: "tuliamani/tributes",
          resourceType: "image",
        }),
      });
      const signData = await signRes.json();

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", signData.apiKey);
      form.append("timestamp", String(signData.timestamp));
      form.append("signature", signData.signature);
      form.append("folder", signData.folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
        {
          method: "POST",
          body: form,
        }
      );
      const data = await uploadRes.json();

      const newImage = {
        url: data.secure_url,
        public_id: data.public_id,
        type,
      };

      if (type === "portrait") {
        setPortrait(newImage);
      } else {
        setGallery((prev) => [...prev, newImage].slice(0, 4)); // Max 4 gallery images
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const images = [...(portrait ? [portrait] : []), ...gallery];

      const updateData = {
        name: formData.name,
        dob: formData.dob,
        dod: formData.dod,
        epitaph: formData.epitaph,
        eulogy: formData.eulogy,
        images,
        funeralInfo: {
          venue: formData.venue,
          time: formData.time,
          streamingLink: formData.streamingLink,
        },
        contributor: {
          name: formData.contribName,
          phone: formData.contribPhone,
          email: formData.contribEmail,
        },
        allowPublicTributes: formData.allowPublicTributes,
      };

      const res = await fetch(`/api/tributes/${obituary._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Failed to update obituary");
      }

      toast({
        title: "Success",
        description: "Obituary updated successfully",
      });

      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!obituary) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Obituary</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="epitaph">Epitaph</Label>
                <Input
                  id="epitaph"
                  value={formData.epitaph}
                  onChange={(e) => handleInputChange("epitaph", e.target.value)}
                  placeholder="Short epitaph"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dod">Date of Death</Label>
                <Input
                  id="dod"
                  type="date"
                  value={formData.dod}
                  onChange={(e) => handleInputChange("dod", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="eulogy">Eulogy *</Label>
              <Textarea
                id="eulogy"
                value={formData.eulogy}
                onChange={(e) => handleInputChange("eulogy", e.target.value)}
                rows={6}
                required
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Images</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Portrait</Label>
                <div className="space-y-2">
                  {portrait && (
                    <img
                      src={portrait.url || "/placeholder.svg"}
                      alt="Portrait"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      handleUpload(e.target.files[0], "portrait")
                    }
                    disabled={uploading}
                  />
                </div>
              </div>
              <div>
                <Label>Gallery (Max 4)</Label>
                <div className="space-y-2">
                  {gallery.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {gallery.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={img.url || "/placeholder.svg"}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-20 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {gallery.length < 4 && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleUpload(e.target.files[0], "gallery")
                      }
                      disabled={uploading}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Funeral Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Funeral Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => handleInputChange("venue", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="time">Date & Time</Label>
                <Input
                  id="time"
                  type="datetime-local"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="streamingLink">Streaming Link</Label>
              <Input
                id="streamingLink"
                type="url"
                value={formData.streamingLink}
                onChange={(e) =>
                  handleInputChange("streamingLink", e.target.value)
                }
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Contributor Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contributor Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contribName">Name</Label>
                <Input
                  id="contribName"
                  value={formData.contribName}
                  onChange={(e) =>
                    handleInputChange("contribName", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="contribPhone">Phone</Label>
                <Input
                  id="contribPhone"
                  value={formData.contribPhone}
                  onChange={(e) =>
                    handleInputChange("contribPhone", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="contribEmail">Email</Label>
                <Input
                  id="contribEmail"
                  type="email"
                  value={formData.contribEmail}
                  onChange={(e) =>
                    handleInputChange("contribEmail", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Settings</h3>
            <div>
              <Label htmlFor="allowPublicTributes">Allow Public Tributes</Label>
              <Select
                value={formData.allowPublicTributes ? "yes" : "no"}
                onValueChange={(value) =>
                  handleInputChange("allowPublicTributes", value === "yes")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit" disabled={loading || uploading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {uploading && <Upload className="w-4 h-4 mr-2" />}
              {loading
                ? "Updating..."
                : uploading
                ? "Uploading..."
                : "Update Obituary"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
