"use client";

import type React from "react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Loader2,
  Upload,
  X,
  Plus,
  Users,
  Heart,
  Phone,
  CreditCard,
  User,
} from "lucide-react";

interface ObituaryEditModalProps {
  obituary: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const epitaphOptions = [
  "In Loving Memory",
  "Forever in Our Hearts",
  "Gone but Never Forgotten",
  "Rest in Peace",
  "Always Remembered",
  "In Our Hearts Forever",
  "Beloved and Remembered",
  "Until We Meet Again",
  "Custom",
];

const relationshipOptions = [
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Spouse",
  "Brother",
  "Sister",
  "Grandfather",
  "Grandmother",
  "Grandson",
  "Granddaughter",
  "Uncle",
  "Aunt",
  "Nephew",
  "Niece",
  "Cousin",
  "Father-in-law",
  "Mother-in-law",
  "Son-in-law",
  "Daughter-in-law",
  "Brother-in-law",
  "Sister-in-law",
  "Stepfather",
  "Stepmother",
  "Stepson",
  "Stepdaughter",
  "Friend",
  "Other",
];

const venueOptions = [
  "Family Home",
  "Church",
  "Mosque",
  "Temple",
  "Community Hall",
  "Funeral Home",
  "Cemetery",
  "Crematorium",
  "Hotel",
  "School",
  "Hospital",
  "Custom",
];

const affirmingPhrases = [
  "Live, Laugh, Love",
  "Faith, Hope, Love",
  "Family First",
  "God's Plan",
  "Love Never Dies",
  "Life is Beautiful",
  "Be Kind Always",
  "Custom",
];

const donationTypes = [
  { value: "hospital_bills", label: "Hospital Bills" },
  { value: "burial_service", label: "Burial Service" },
  { value: "family_support", label: "Family Support" },
  { value: "other", label: "Other" },
];

export function ObituaryEditModal({
  obituary,
  open,
  onOpenChange,
  onUpdate,
}: ObituaryEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    fullName: "",
    dateOfBirth: "",
    dateOfDeath: "",
    epitaph: "",
    customEpitaph: "",
    eulogy: "",
    affirmingPhrase: "",
    customAffirmingPhrase: "",

    // Step 2: Memorial Content
    familyGatheringNotes: "",
    donationMessage: "",
    acknowledgements: "",

    // Step 3: Publisher Details
    publisherName: "",
    publisherRelationship: "",
    publisherPhone: "",
    publisherAlternatePhone: "",
    publisherEmail: "",
    preferredContact: "whatsapp",

    // Step 4: Settings
    allowPublicTributes: true,
    mpesaConfirmationCode: "",
    paymentYears: 1,
    publisherAcknowledgement: false,
  });

  const [mainPortrait, setMainPortrait] = useState<any>(null);
  const [imageGallery, setImageGallery] = useState<any[]>([]);
  const [familyTree, setFamilyTree] = useState<any[]>([]);
  const [donationRequests, setDonationRequests] = useState<any[]>([]);
  const [memorialServices, setMemorialServices] = useState<any[]>([]);
  const [burialServices, setBurialServices] = useState<any[]>([]);

  useEffect(() => {
    if (obituary && open) {
      setFormData({
        fullName: obituary.fullName || obituary.name || "",
        dateOfBirth: obituary.dateOfBirth || obituary.dob || "",
        dateOfDeath: obituary.dateOfDeath || obituary.dod || "",
        epitaph: obituary.epitaph || "",
        customEpitaph: "",
        eulogy: obituary.eulogy || "",
        affirmingPhrase: obituary.affirmingPhrase || "",
        customAffirmingPhrase: "",
        familyGatheringNotes: obituary.familyGatheringNotes || "",
        donationMessage: obituary.donationMessage || "",
        acknowledgements: obituary.acknowledgements || "",
        publisherName: obituary.publisher?.name || "",
        publisherRelationship: obituary.publisher?.relationship || "",
        publisherPhone: obituary.publisher?.phone || "",
        publisherAlternatePhone: obituary.publisher?.alternatePhone || "",
        publisherEmail: obituary.publisher?.email || "",
        preferredContact: obituary.publisher?.preferredContact || "whatsapp",
        allowPublicTributes: obituary.allowPublicTributes ?? true,
        mpesaConfirmationCode: obituary.mpesaConfirmationCode || "",
        paymentYears: obituary.paymentYears || 1,
        publisherAcknowledgement: obituary.publisherAcknowledgement || false,
      });

      // Handle images
      if (obituary.mainPortrait) {
        setMainPortrait(obituary.mainPortrait);
      } else if (obituary.images) {
        const portrait = obituary.images.find(
          (i: any) => i.type === "portrait"
        );
        setMainPortrait(portrait || null);
      }

      if (obituary.imageGallery) {
        setImageGallery(obituary.imageGallery);
      } else if (obituary.images) {
        const gallery = obituary.images.filter(
          (i: any) => i.type === "gallery"
        );
        setImageGallery(gallery);
      }

      // Handle other arrays
      setFamilyTree(obituary.familyTree || []);
      setDonationRequests(obituary.donationRequests || []);
      setMemorialServices(obituary.memorialServices || []);
      setBurialServices(obituary.burialServices || []);
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
        setMainPortrait(newImage);
      } else {
        setImageGallery((prev) => [...prev, newImage].slice(0, 5));
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

  const addFamilyMember = () => {
    setFamilyTree((prev) => [
      ...prev,
      { name: "", relationship: "", deceased: false },
    ]);
  };

  const updateFamilyMember = (index: number, field: string, value: any) => {
    setFamilyTree((prev) =>
      prev.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
  };

  const removeFamilyMember = (index: number) => {
    setFamilyTree((prev) => prev.filter((_, i) => i !== index));
  };

  const addDonationRequest = () => {
    setDonationRequests((prev) => [
      ...prev,
      { type: "family_support", message: "", details: "" },
    ]);
  };

  const updateDonationRequest = (index: number, field: string, value: any) => {
    setDonationRequests((prev) =>
      prev.map((req, i) => (i === index ? { ...req, [field]: value } : req))
    );
  };

  const removeDonationRequest = (index: number) => {
    setDonationRequests((prev) => prev.filter((_, i) => i !== index));
  };

  const addService = (type: "memorial" | "burial") => {
    const newService = {
      type,
      venue: "",
      date: "",
      time: "",
      programmeLink: "",
      streamingLink: "",
    };
    if (type === "memorial") {
      setMemorialServices((prev) => [...prev, newService]);
    } else {
      setBurialServices((prev) => [...prev, newService]);
    }
  };

  const updateService = (
    type: "memorial" | "burial",
    index: number,
    field: string,
    value: any
  ) => {
    if (type === "memorial") {
      setMemorialServices((prev) =>
        prev.map((service, i) =>
          i === index ? { ...service, [field]: value } : service
        )
      );
    } else {
      setBurialServices((prev) =>
        prev.map((service, i) =>
          i === index ? { ...service, [field]: value } : service
        )
      );
    }
  };

  const removeService = (type: "memorial" | "burial", index: number) => {
    if (type === "memorial") {
      setMemorialServices((prev) => prev.filter((_, i) => i !== index));
    } else {
      setBurialServices((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        // Step 1: Personal Details
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        dateOfDeath: formData.dateOfDeath,
        epitaph:
          formData.epitaph === "Custom"
            ? formData.customEpitaph
            : formData.epitaph,
        eulogy: formData.eulogy,
        affirmingPhrase:
          formData.affirmingPhrase === "Custom"
            ? formData.customAffirmingPhrase
            : formData.affirmingPhrase,

        // Step 2: Memorial Content
        mainPortrait,
        imageGallery,
        familyGatheringNotes: formData.familyGatheringNotes,
        donationRequests,
        donationMessage: formData.donationMessage,
        memorialServices,
        burialServices,
        familyTree,
        acknowledgements: formData.acknowledgements,

        // Step 3: Publisher Details
        publisher: {
          name: formData.publisherName,
          relationship: formData.publisherRelationship,
          phone: formData.publisherPhone,
          alternatePhone: formData.publisherAlternatePhone,
          email: formData.publisherEmail,
          preferredContact: formData.preferredContact,
        },

        // Step 4: Settings
        allowPublicTributes: formData.allowPublicTributes,
        mpesaConfirmationCode: formData.mpesaConfirmationCode,
        paymentYears: formData.paymentYears,
        publisherAcknowledgement: formData.publisherAcknowledgement,
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

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  if (!obituary) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            Edit Memorial
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step ? "✓" : step}
              </div>
              {step < 4 && (
                <div
                  className={`w-20 h-1 mx-2 ${
                    currentStep > step ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Personal Details of the Deceased
                    </h3>
                    <p className="text-blue-100">
                      Basic information about your loved one
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    placeholder="Include all titles, nicknames and honorifics"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="epitaph">Epitaph</Label>
                  <Select
                    value={formData.epitaph}
                    onValueChange={(value) =>
                      handleInputChange("epitaph", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a loving phrase" />
                    </SelectTrigger>
                    <SelectContent>
                      {epitaphOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.epitaph === "Custom" && (
                    <Input
                      className="mt-2"
                      value={formData.customEpitaph}
                      onChange={(e) =>
                        handleInputChange("customEpitaph", e.target.value)
                      }
                      placeholder="Enter custom epitaph"
                    />
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfDeath">Date of Death *</Label>
                  <Input
                    id="dateOfDeath"
                    type="date"
                    value={formData.dateOfDeath}
                    onChange={(e) =>
                      handleInputChange("dateOfDeath", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="eulogy">Life Story (Eulogy) *</Label>
                <Textarea
                  id="eulogy"
                  value={formData.eulogy}
                  onChange={(e) => handleInputChange("eulogy", e.target.value)}
                  rows={6}
                  placeholder="Write their life story: childhood, education, career, family life, passions, values, impact..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="affirmingPhrase">Affirming Phrase</Label>
                <Select
                  value={formData.affirmingPhrase}
                  onValueChange={(value) =>
                    handleInputChange("affirmingPhrase", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a meaningful phrase" />
                  </SelectTrigger>
                  <SelectContent>
                    {affirmingPhrases.map((phrase) => (
                      <SelectItem key={phrase} value={phrase}>
                        {phrase}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.affirmingPhrase === "Custom" && (
                  <Input
                    className="mt-2"
                    value={formData.customAffirmingPhrase}
                    onChange={(e) =>
                      handleInputChange("customAffirmingPhrase", e.target.value)
                    }
                    placeholder="Enter custom affirming phrase"
                  />
                )}
              </div>
            </div>
          )}

          {/* Step 2: Memorial Content */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Memorial Content & Service Details
                    </h3>
                    <p className="text-blue-100">
                      Images, services, and family information
                    </p>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Main Portrait *</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mainPortrait && (
                      <img
                        src={mainPortrait.url || "/placeholder.svg"}
                        alt="Portrait"
                        className="w-full h-32 object-cover rounded-md mb-2"
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
                      className="w-full"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Image Gallery (Max 5)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {imageGallery.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {imageGallery.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={img.url || "/placeholder.svg"}
                              alt={`Gallery ${idx + 1}`}
                              className="w-full h-20 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setImageGallery((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                )
                              }
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {imageGallery.length < 5 && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleUpload(e.target.files[0], "gallery")
                        }
                        disabled={uploading}
                        className="w-full"
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Family Tree Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <CardTitle>Family Tree</CardTitle>
                    </div>
                    <Button
                      type="button"
                      onClick={addFamilyMember}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Family Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {familyTree.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No family members added yet</p>
                      <p className="text-sm">
                        Click "Add Family Member" to start building the family
                        tree
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {familyTree.map((member, index) => (
                        <Card key={index} className="border-blue-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <Badge
                                variant="outline"
                                className="text-blue-600 border-blue-200"
                              >
                                Family Member {index + 1}
                              </Badge>
                              <Button
                                type="button"
                                onClick={() => removeFamilyMember(index)}
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                              <div>
                                <Label>Name</Label>
                                <Input
                                  value={member.name}
                                  onChange={(e) =>
                                    updateFamilyMember(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Full name"
                                />
                              </div>
                              <div>
                                <Label>Relationship</Label>
                                <Select
                                  value={member.relationship}
                                  onValueChange={(value) =>
                                    updateFamilyMember(
                                      index,
                                      "relationship",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select relationship" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {relationshipOptions.map((rel) => (
                                      <SelectItem key={rel} value={rel}>
                                        {rel}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center space-x-2 pt-6">
                                <Checkbox
                                  id={`deceased-${index}`}
                                  checked={member.deceased}
                                  onCheckedChange={(checked) =>
                                    updateFamilyMember(
                                      index,
                                      "deceased",
                                      checked
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`deceased-${index}`}
                                  className="text-sm"
                                >
                                  Deceased
                                </Label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Services Section */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        Memorial Services
                      </CardTitle>
                      <Button
                        type="button"
                        onClick={() => addService("memorial")}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Service
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {memorialServices.map((service, index) => (
                      <div
                        key={index}
                        className="space-y-3 p-3 border rounded-lg mb-3"
                      >
                        <div className="flex justify-between items-center">
                          <Badge>Memorial Service {index + 1}</Badge>
                          <Button
                            type="button"
                            onClick={() => removeService("memorial", index)}
                            size="sm"
                            variant="ghost"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid gap-2">
                          <Select
                            value={service.venue}
                            onValueChange={(value) =>
                              updateService("memorial", index, "venue", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select venue" />
                            </SelectTrigger>
                            <SelectContent>
                              {venueOptions.map((venue) => (
                                <SelectItem key={venue} value={venue}>
                                  {venue}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="date"
                            value={service.date}
                            onChange={(e) =>
                              updateService(
                                "memorial",
                                index,
                                "date",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            type="time"
                            value={service.time}
                            onChange={(e) =>
                              updateService(
                                "memorial",
                                index,
                                "time",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Streaming link (optional)"
                            value={service.streamingLink}
                            onChange={(e) =>
                              updateService(
                                "memorial",
                                index,
                                "streamingLink",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Burial Services</CardTitle>
                      <Button
                        type="button"
                        onClick={() => addService("burial")}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Service
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {burialServices.map((service, index) => (
                      <div
                        key={index}
                        className="space-y-3 p-3 border rounded-lg mb-3"
                      >
                        <div className="flex justify-between items-center">
                          <Badge>Burial Service {index + 1}</Badge>
                          <Button
                            type="button"
                            onClick={() => removeService("burial", index)}
                            size="sm"
                            variant="ghost"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid gap-2">
                          <Select
                            value={service.venue}
                            onValueChange={(value) =>
                              updateService("burial", index, "venue", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select venue" />
                            </SelectTrigger>
                            <SelectContent>
                              {venueOptions.map((venue) => (
                                <SelectItem key={venue} value={venue}>
                                  {venue}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="date"
                            value={service.date}
                            onChange={(e) =>
                              updateService(
                                "burial",
                                index,
                                "date",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            type="time"
                            value={service.time}
                            onChange={(e) =>
                              updateService(
                                "burial",
                                index,
                                "time",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Streaming link (optional)"
                            value={service.streamingLink}
                            onChange={(e) =>
                              updateService(
                                "burial",
                                index,
                                "streamingLink",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Donation Requests */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Donation Requests</CardTitle>
                    <Button
                      type="button"
                      onClick={addDonationRequest}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Request
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {donationRequests.map((request, index) => (
                    <div
                      key={index}
                      className="space-y-3 p-3 border rounded-lg mb-3"
                    >
                      <div className="flex justify-between items-center">
                        <Badge>Request {index + 1}</Badge>
                        <Button
                          type="button"
                          onClick={() => removeDonationRequest(index)}
                          size="sm"
                          variant="ghost"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid gap-3">
                        <Select
                          value={request.type}
                          onValueChange={(value) =>
                            updateDonationRequest(index, "type", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {donationTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Textarea
                          placeholder="Donation message"
                          value={request.message}
                          onChange={(e) =>
                            updateDonationRequest(
                              index,
                              "message",
                              e.target.value
                            )
                          }
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="familyGatheringNotes">
                    Family Gathering Notes
                  </Label>
                  <Textarea
                    id="familyGatheringNotes"
                    value={formData.familyGatheringNotes}
                    onChange={(e) =>
                      handleInputChange("familyGatheringNotes", e.target.value)
                    }
                    placeholder="Describe where friends and family are meeting"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="acknowledgements">Acknowledgements</Label>
                  <Textarea
                    id="acknowledgements"
                    value={formData.acknowledgements}
                    onChange={(e) =>
                      handleInputChange("acknowledgements", e.target.value)
                    }
                    placeholder="Write a message of thanks"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Publisher Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6" />
                  <div>
                    <h3 className="text-lg font-semibold">Publisher Details</h3>
                    <p className="text-blue-100">
                      Contact information for the person publishing this
                      memorial
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="publisherName">Publisher Name *</Label>
                  <Input
                    id="publisherName"
                    value={formData.publisherName}
                    onChange={(e) =>
                      handleInputChange("publisherName", e.target.value)
                    }
                    placeholder="First and last name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="publisherRelationship">
                    Relationship with Deceased *
                  </Label>
                  <Select
                    value={formData.publisherRelationship}
                    onValueChange={(value) =>
                      handleInputChange("publisherRelationship", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationshipOptions.map((rel) => (
                        <SelectItem key={rel} value={rel}>
                          {rel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="publisherPhone">Phone Number *</Label>
                  <Input
                    id="publisherPhone"
                    value={formData.publisherPhone}
                    onChange={(e) =>
                      handleInputChange("publisherPhone", e.target.value)
                    }
                    placeholder="+254 700 000 000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="publisherAlternatePhone">
                    Alternate Phone Number
                  </Label>
                  <Input
                    id="publisherAlternatePhone"
                    value={formData.publisherAlternatePhone}
                    onChange={(e) =>
                      handleInputChange(
                        "publisherAlternatePhone",
                        e.target.value
                      )
                    }
                    placeholder="+254 700 000 000"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="publisherEmail">Email Address *</Label>
                  <Input
                    id="publisherEmail"
                    type="email"
                    value={formData.publisherEmail}
                    onChange={(e) =>
                      handleInputChange("publisherEmail", e.target.value)
                    }
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="preferredContact">
                    Preferred Contact Method *
                  </Label>
                  <Select
                    value={formData.preferredContact}
                    onValueChange={(value) =>
                      handleInputChange("preferredContact", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms_call">SMS/Call</SelectItem>
                      <SelectItem value="whatsapp">
                        WhatsApp/Chat/Call
                      </SelectItem>
                      <SelectItem value="email_only">Email Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment & Settings */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Payment & Publishing Preferences
                    </h3>
                    <p className="text-blue-100">
                      Final settings and payment confirmation
                    </p>
                  </div>
                </div>
              </div>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-600">
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Memorial Duration</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {[1, 2, 3].map((years) => (
                        <button
                          key={years}
                          type="button"
                          onClick={() =>
                            handleInputChange("paymentYears", years)
                          }
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            formData.paymentYears === years
                              ? "border-blue-600 bg-blue-50 text-blue-600"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="font-semibold">
                            {years} Year{years > 1 ? "s" : ""}
                          </div>
                          <div className="text-sm text-gray-600">
                            KES {(25000 * years).toLocaleString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Payment Instructions
                    </h4>
                    <p className="text-blue-700 text-sm mb-2">
                      Pay via M-Pesa Till Number:{" "}
                      <strong>781086 - RoundSquare Marketing</strong>
                    </p>
                    <p className="text-blue-700 text-sm">
                      Total Amount:{" "}
                      <strong>
                        KES {(25000 * formData.paymentYears).toLocaleString()}
                      </strong>
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="mpesaConfirmationCode">
                      M-Pesa Confirmation Code *
                    </Label>
                    <Input
                      id="mpesaConfirmationCode"
                      value={formData.mpesaConfirmationCode}
                      onChange={(e) =>
                        handleInputChange(
                          "mpesaConfirmationCode",
                          e.target.value
                        )
                      }
                      placeholder="Enter M-Pesa confirmation code"
                      className="font-mono"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-600">
                    Memorial Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowPublicTributes"
                      checked={formData.allowPublicTributes}
                      onCheckedChange={(checked) =>
                        handleInputChange("allowPublicTributes", checked)
                      }
                    />
                    <Label htmlFor="allowPublicTributes">
                      Allow public tribute messages from visitors
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-600">
                    Publisher Acknowledgement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="publisherAcknowledgement"
                        checked={formData.publisherAcknowledgement}
                        onCheckedChange={(checked) =>
                          handleInputChange("publisherAcknowledgement", checked)
                        }
                        required
                      />
                      <Label
                        htmlFor="publisherAcknowledgement"
                        className="text-sm leading-relaxed"
                      >
                        I confirm that all information provided is accurate, I
                        have the right to publish this memorial, I understand
                        this memorial will be published for{" "}
                        {formData.paymentYears} year
                        {formData.paymentYears > 1 ? "s" : ""}, I can edit the
                        memorial during this period, I am responsible for
                        downloading tribute messages, and I understand renewal
                        options are available.
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <Button type="button" onClick={prevStep} variant="outline">
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={loading || uploading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {uploading && <Upload className="w-4 h-4 mr-2" />}
                  {loading
                    ? "Updating..."
                    : uploading
                    ? "Uploading..."
                    : "Update Memorial"}
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
