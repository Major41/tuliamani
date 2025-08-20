"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Heart, Calendar, MapPin, User, Users, Church, Send, X, ChevronLeft, ChevronRight } from "lucide-react"

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

interface MemorialDetailModalProps {
  memorial: Memorial
  isOpen: boolean
  onClose: () => void
}

interface TributeFormData {
  name: string
  email: string
  relationship: string
  message: string
}

export function MemorialDetailModal({ memorial, isOpen, onClose }: MemorialDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "tribute">("details")
  const [tributeForm, setTributeForm] = useState<TributeFormData>({
    name: "",
    email: "",
    relationship: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  const handleTributeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tributeForm.name.trim() || !tributeForm.message.trim()) {
      toast.error("Please fill in your name and message")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/obituaries/${memorial._id}/tributes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tributeForm.name.trim(),
          email: tributeForm.email.trim(),
          relationship: tributeForm.relationship.trim(),
          message: tributeForm.message.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Your tribute has been submitted and is pending approval")
        setTributeForm({
          name: "",
          email: "",
          relationship: "",
          message: "",
        })
        setActiveTab("details")
      } else {
        throw new Error(data.error || "Failed to submit tribute")
      }
    } catch (error) {
      console.error("Error submitting tribute:", error)
      toast.error("Failed to submit tribute. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextImage = () => {
    if (memorial.galleryImages.length > 0) {
      setCurrentImageIndex((prev) => (prev === memorial.galleryImages.length - 1 ? 0 : prev + 1))
    }
  }

  const prevImage = () => {
    if (memorial.galleryImages.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? memorial.galleryImages.length - 1 : prev - 1))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-900 border-gray-700 text-white">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">{memorial.fullName}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(memorial.dateOfBirth)} - {formatDate(memorial.dateOfDeath)}
              </span>
              {getAge(memorial.dateOfBirth, memorial.dateOfDeath) && (
                <Badge variant="secondary" className="bg-gray-700 text-gray-200">
                  Age {getAge(memorial.dateOfBirth, memorial.dateOfDeath)}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant={activeTab === "details" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("details")}
              className={
                activeTab === "details"
                  ? "bg-white text-black hover:bg-gray-200"
                  : "border-gray-600 text-gray-200 hover:bg-gray-800"
              }
            >
              Memorial Details
            </Button>
            <Button
              variant={activeTab === "tribute" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("tribute")}
              className={
                activeTab === "tribute"
                  ? "bg-white text-black hover:bg-gray-200"
                  : "border-gray-600 text-gray-200 hover:bg-gray-800"
              }
            >
              <Heart className="h-4 w-4 mr-2" />
              Leave Tribute
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="p-6 space-y-6">
            {activeTab === "details" && (
              <>
                {/* Portrait and Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {memorial.portraitUrl && (
                      <div className="relative">
                        <img
                          src={memorial.portraitUrl || "/placeholder.svg"}
                          alt={memorial.fullName}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {memorial.galleryImages && memorial.galleryImages.length > 0 && (
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white">Photo Gallery</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <img
                              src={memorial.galleryImages[currentImageIndex].url || "/placeholder.svg"}
                              alt={memorial.galleryImages[currentImageIndex].caption || "Gallery image"}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            {memorial.galleryImages.length > 1 && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={prevImage}
                                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={nextImage}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                                  {currentImageIndex + 1} / {memorial.galleryImages.length}
                                </div>
                              </>
                            )}
                          </div>
                          {memorial.galleryImages[currentImageIndex].caption && (
                            <p className="text-sm text-gray-300 mt-2 text-center">
                              {memorial.galleryImages[currentImageIndex].caption}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Biography */}
                    {memorial.biography && (
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white">Biography</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 leading-relaxed">{memorial.biography}</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Epitaph */}
                    {memorial.epitaph && (
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white">Epitaph</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <blockquote className="text-gray-300 italic text-center border-l-4 border-gray-600 pl-4">
                            "{memorial.epitaph}"
                          </blockquote>
                        </CardContent>
                      </Card>
                    )}

                    {/* Birth and Death Places */}
                    {(memorial.placeOfBirth || memorial.placeOfDeath) && (
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white">Places</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {memorial.placeOfBirth && (
                            <div className="flex items-center gap-2 text-gray-300">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">Born:</span>
                              <span>{memorial.placeOfBirth}</span>
                            </div>
                          )}
                          {memorial.placeOfDeath && (
                            <div className="flex items-center gap-2 text-gray-300">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">Died:</span>
                              <span>{memorial.placeOfDeath}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Family Tree */}
                {memorial.familyTree && memorial.familyTree.length > 0 && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Users className="h-5 w-5" />
                        Family Tree
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {memorial.familyTree.map((member, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                            <Avatar>
                              <AvatarFallback className="bg-gray-600 text-gray-200">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-white">{member.name}</p>
                              <p className="text-sm text-gray-300">{member.relationship}</p>
                              {member.dateOfBirth && (
                                <p className="text-xs text-gray-400">Born: {formatDate(member.dateOfBirth)}</p>
                              )}
                              {member.isDeceased && member.dateOfDeath && (
                                <p className="text-xs text-gray-400">Died: {formatDate(member.dateOfDeath)}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Memorial Services */}
                {memorial.memorialServices && memorial.memorialServices.length > 0 && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Church className="h-5 w-5" />
                        Memorial Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {memorial.memorialServices.map((service, index) => (
                        <div key={index} className="p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">{service.type}</h4>
                            <Badge variant="outline" className="border-gray-500 text-gray-300">
                              {formatDate(service.date)}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{service.venue}</span>
                            </div>
                            {service.address && <p className="ml-6 text-gray-400">{service.address}</p>}
                            {service.time && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{service.time}</span>
                              </div>
                            )}
                            {service.description && <p className="mt-2 text-gray-300">{service.description}</p>}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Burial Services */}
                {memorial.burialServices && memorial.burialServices.length > 0 && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <MapPin className="h-5 w-5" />
                        Burial Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {memorial.burialServices.map((service, index) => (
                        <div key={index} className="p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">{service.type}</h4>
                            <Badge variant="outline" className="border-gray-500 text-gray-300">
                              {formatDate(service.date)}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{service.venue}</span>
                            </div>
                            {service.address && <p className="ml-6 text-gray-400">{service.address}</p>}
                            {service.time && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{service.time}</span>
                              </div>
                            )}
                            {service.description && <p className="mt-2 text-gray-300">{service.description}</p>}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {activeTab === "tribute" && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Heart className="h-5 w-5" />
                    Leave a Tribute for {memorial.fullName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTributeSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-200">
                          Your Name *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={tributeForm.name}
                          onChange={(e) => setTributeForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-200">
                          Email (optional)
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={tributeForm.email}
                          onChange={(e) => setTributeForm((prev) => ({ ...prev, email: e.target.value }))}
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="relationship" className="text-gray-200">
                        Relationship (optional)
                      </Label>
                      <Input
                        id="relationship"
                        type="text"
                        value={tributeForm.relationship}
                        onChange={(e) => setTributeForm((prev) => ({ ...prev, relationship: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        placeholder="e.g., Friend, Colleague, Family member"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-gray-200">
                        Your Message *
                      </Label>
                      <Textarea
                        id="message"
                        value={tributeForm.message}
                        onChange={(e) => setTributeForm((prev) => ({ ...prev, message: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[120px]"
                        placeholder="Share your memories, condolences, or thoughts about this person..."
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-white text-black hover:bg-gray-200"
                      >
                        {isSubmitting ? (
                          "Submitting..."
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Tribute
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("details")}
                        className="border-gray-600 text-gray-200 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>

                  <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-300">
                      <strong>Note:</strong> Your tribute will be reviewed before being published. We appreciate your
                      thoughtful words during this difficult time.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
