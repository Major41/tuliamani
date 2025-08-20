"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  X,
  Upload,
  User,
  Heart,
  Phone,
  CreditCard,
  CheckCircle,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type UploadItem = {
  url: string;
  public_id: string;
  type: "portrait" | "gallery";
};

interface MemorialService {
  type: "memorial" | "burial";
  venue: string;
  date: string;
  time: string;
  programmeLink?: string;
  streamingLink?: string;
  pdfUrl?: string;
}

interface FamilyMember {
  name: string;
  relationship: string;
  deceased: boolean;
}

interface DonationRequest {
  type: "hospital_bills" | "burial_service" | "family_support" | "other";
  message: string;
  details?: string;
}

// Predefined options for better UX
const EPITAPH_OPTIONS = [
  "In Loving Memory",
  "Forever in Our Hearts",
  "Gone but Never Forgotten",
  "Rest in Peace",
  "Always Remembered",
  "Until We Meet Again",
  "In God's Hands",
  "Beloved and Remembered",
  "Custom",
];

const RELATIONSHIP_OPTIONS = [
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Husband",
  "Wife",
  "Brother",
  "Sister",
  "Grandfather",
  "Grandmother",
  "Uncle",
  "Aunt",
  "Cousin",
  "Nephew",
  "Niece",
  "Son-in-law",
  "Daughter-in-law",
  "Father-in-law",
  "Mother-in-law",
  "Stepfather",
  "Stepmother",
  "Stepson",
  "Stepdaughter",
  "Grandchild",
  "Great-grandparent",
  "Great-grandchild",
  "Other",
];

const PUBLISHER_RELATIONSHIP_OPTIONS = [
  "Child",
  "Spouse",
  "Parent",
  "Sibling",
  "Relative",
  "Friend",
  "Family Representative",
  "Funeral Director",
  "Agent",
  "Planner",
  "Other",
];

const VENUE_SUGGESTIONS = [
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
  "Hospital Chapel",
  "Other",
];

const AFFIRMING_PHRASES = [
  "God's time is the best",
  "Well done good and faithful servant",
  "To live in hearts we leave behind is not to die",
  "Death is not the end, but a new beginning",
  "Your memory will live on forever",
  "You fought the good fight",
  "Custom",
];

export default function NewTributePage() {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1: Personal Details
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfDeath, setDateOfDeath] = useState("");
  const [epitaph, setEpitaph] = useState("");
  const [customEpitaph, setCustomEpitaph] = useState("");
  const [eulogy, setEulogy] = useState("");
  const [affirmingPhrase, setAffirmingPhrase] = useState("");
  const [customAffirmingPhrase, setCustomAffirmingPhrase] = useState("");

  // Step 2: Memorial Content & Service Details
  const [mainPortrait, setMainPortrait] = useState<UploadItem | null>(null);
  const [imageGallery, setImageGallery] = useState<UploadItem[]>([]);
  const [familyGatheringNotes, setFamilyGatheringNotes] = useState("");
  const [donationRequests, setDonationRequests] = useState<DonationRequest[]>(
    []
  );
  const [donationMessage, setDonationMessage] = useState("");
  const [memorialServices, setMemorialServices] = useState<MemorialService[]>(
    []
  );
  const [burialServices, setBurialServices] = useState<MemorialService[]>([]);
  const [familyTree, setFamilyTree] = useState<FamilyMember[]>([]);
  const [acknowledgements, setAcknowledgements] = useState("");

  // Step 3: Publisher Details
  const [publisherName, setPublisherName] = useState("");
  const [publisherRelationship, setPublisherRelationship] = useState("");
  const [customPublisherRelationship, setCustomPublisherRelationship] =
    useState("");
  const [publisherPhone, setPublisherPhone] = useState("");
  const [publisherAlternatePhone, setPublisherAlternatePhone] = useState("");
  const [publisherEmail, setPublisherEmail] = useState("");
  const [preferredContact, setPreferredContact] = useState<
    "sms_call" | "whatsapp" | "email_only"
  >("whatsapp");

  // Step 4: Payment & Publishing
  const [mpesaCode, setMpesaCode] = useState("");
  const [allowPublicTributes, setAllowPublicTributes] = useState(true);
  const [publisherAcknowledgement, setPublisherAcknowledgement] =
    useState(false);
  const [paymentYears, setPaymentYears] = useState(1);

  const canNext = useMemo(() => {
    if (step === 1)
      return !!fullName && !!dateOfBirth && !!dateOfDeath && !!eulogy;
    if (step === 2) return !!mainPortrait;
    if (step === 3)
      return (
        !!publisherName &&
        !!publisherRelationship &&
        !!publisherPhone &&
        !!publisherEmail
      );
    if (step === 4) return !!mpesaCode && publisherAcknowledgement;
    return true;
  }, [
    step,
    fullName,
    dateOfBirth,
    dateOfDeath,
    eulogy,
    mainPortrait,
    publisherName,
    publisherRelationship,
    publisherPhone,
    publisherEmail,
    mpesaCode,
    publisherAcknowledgement,
  ]);

  async function handleUpload(file: File, type: "portrait" | "gallery") {
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
      const cloudName = signData.cloudName;
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: form,
        }
      );
      const data = await uploadRes.json();
      const item: UploadItem = {
        url: data.secure_url,
        public_id: data.public_id,
        type,
      };
      if (type === "portrait") setMainPortrait(item);
      else
        setImageGallery((prev) => (prev.length < 5 ? [...prev, item] : prev));
    } catch (error) {
      alert("Failed to upload image. Please try again.");
    }
  }

  const addMemorialService = (type: "memorial" | "burial") => {
    const newService: MemorialService = {
      type,
      venue: "",
      date: "",
      time: "",
      programmeLink: "",
      streamingLink: "",
      pdfUrl: "",
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
    field: keyof MemorialService,
    value: string
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

  const addFamilyMember = () => {
    setFamilyTree((prev) => [
      ...prev,
      { name: "", relationship: "", deceased: false },
    ]);
  };

  const updateFamilyMember = (
    index: number,
    field: keyof FamilyMember,
    value: string | boolean
  ) => {
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

  const updateDonationRequest = (
    index: number,
    field: keyof DonationRequest,
    value: string
  ) => {
    setDonationRequests((prev) =>
      prev.map((request, i) =>
        i === index ? { ...request, [field]: value } : request
      )
    );
  };

  const removeDonationRequest = (index: number) => {
    setDonationRequests((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit() {
    setSaving(true);
    try {
      const finalEpitaph = epitaph === "Custom" ? customEpitaph : epitaph;
      const finalAffirmingPhrase =
        affirmingPhrase === "Custom" ? customAffirmingPhrase : affirmingPhrase;
      const finalPublisherRelationship =
        publisherRelationship === "Other"
          ? customPublisherRelationship
          : publisherRelationship;

      const res = await fetch("/api/obituaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Step 1: Personal Details
          fullName,
          dateOfBirth,
          dateOfDeath,
          epitaph: finalEpitaph,
          eulogy,
          affirmingPhrase: finalAffirmingPhrase,

          // Step 2: Memorial Content & Service Details
          mainPortrait,
          imageGallery,
          familyGatheringNotes,
          donationRequests,
          donationMessage,
          memorialServices,
          burialServices,
          familyTree,
          acknowledgements,

          // Step 3: Publisher Details
          publisher: {
            name: publisherName,
            relationship: finalPublisherRelationship,
            phone: publisherPhone,
            alternatePhone: publisherAlternatePhone,
            email: publisherEmail,
            preferredContact: preferredContact,
          },

          // Step 4: Payment & Publishing
          mpesaConfirmationCode: mpesaCode,
          allowPublicTributes,
          publisherAcknowledgement,
          paymentYears,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error || "Failed to submit memorial");
      }
      window.location.href = "/dashboard";
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  const stepIcons = [User, Heart, Phone, CreditCard];
  const stepTitles = [
    "Personal Details",
    "Memorial Content",
    "Publisher Info",
    "Payment & Publishing",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
            Create Memorial
          </h1>
          <p className="text-lg text-muted-foreground">
            Honor your loved one with a beautiful digital memorial
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {stepTitles.map((title, index) => {
              const Icon = stepIcons[index];
              const isActive = step === index + 1;
              const isCompleted = step > index + 1;
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
                      isActive
                        ? "bg-blue-600 text-white shadow-lg scale-110"
                        : isCompleted
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isActive ? "text-blue-600" : "text-gray-500"
                    )}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 flex-1 rounded-full transition-all duration-300",
                  i < step
                    ? "bg-gradient-to-r from-blue-500 to-blue-600"
                    : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-8">
          {step === 1 && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Details of the Deceased
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Provide the essential information about your loved one
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-base font-semibold">
                    Full Name of the Deceased *
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Include all titles, nicknames and honourifics (e.g. Dr., Mama, Baba, Reverend)"
                    className="h-12 text-base"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-base font-semibold">
                      Date of Birth *
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dod" className="text-base font-semibold">
                      Date of Death *
                    </Label>
                    <Input
                      id="dod"
                      type="date"
                      value={dateOfDeath}
                      onChange={(e) => setDateOfDeath(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">
                    Epitaph (Optional)
                  </Label>
                  <Select value={epitaph} onValueChange={setEpitaph}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Choose a loving phrase or select Custom" />
                    </SelectTrigger>
                    <SelectContent>
                      {EPITAPH_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {epitaph === "Custom" && (
                    <Input
                      value={customEpitaph}
                      onChange={(e) => setCustomEpitaph(e.target.value)}
                      placeholder="Enter your custom epitaph"
                      className="h-12 text-base mt-2"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eulogy" className="text-base font-semibold">
                    Eulogy *
                  </Label>
                  <Textarea
                    id="eulogy"
                    value={eulogy}
                    onChange={(e) => setEulogy(e.target.value)}
                    rows={8}
                    placeholder="Write their life story: childhood, education, career, family life, passions, values, impact..."
                    className="text-base resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">
                    Affirming Phrase (Optional)
                  </Label>
                  <Select
                    value={affirmingPhrase}
                    onValueChange={setAffirmingPhrase}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Choose a meaningful phrase or select Custom" />
                    </SelectTrigger>
                    <SelectContent>
                      {AFFIRMING_PHRASES.map((phrase) => (
                        <SelectItem key={phrase} value={phrase}>
                          {phrase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {affirmingPhrase === "Custom" && (
                    <Input
                      value={customAffirmingPhrase}
                      onChange={(e) => setCustomAffirmingPhrase(e.target.value)}
                      placeholder="Enter your custom affirming phrase"
                      className="h-12 text-base mt-2"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Memorial Content & Service Details
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Add images, service details, and family information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Images Section */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">
                      Main Portrait Image *
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Upload the primary image that will accompany the memorial
                    </p>
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      {mainPortrait ? (
                        <div className="space-y-4">
                          <img
                            src={mainPortrait.url || "/placeholder.svg"}
                            alt="Portrait"
                            className="h-48 w-48 mx-auto rounded-lg object-cover shadow-lg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setMainPortrait(null)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-12 h-12 mx-auto text-blue-400" />
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                e.target.files?.[0] &&
                                handleUpload(e.target.files[0], "portrait")
                              }
                              className="hidden"
                              id="portrait-upload"
                            />
                            <Label
                              htmlFor="portrait-upload"
                              className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                            >
                              Choose Portrait Image
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">
                      Image Gallery (Up to 5 images)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Upload images showing different stages of life and
                      memories
                    </p>
                    {imageGallery.length < 5 && (
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            e.target.files?.[0] &&
                            handleUpload(e.target.files[0], "gallery")
                          }
                          className="hidden"
                          id="gallery-upload"
                        />
                        <Label
                          htmlFor="gallery-upload"
                          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                        >
                          <Plus className="w-4 h-4 inline mr-2" />
                          Add Gallery Image
                        </Label>
                      </div>
                    )}
                    <div className="grid grid-cols-5 gap-4">
                      {imageGallery.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img.url || "/placeholder.svg"}
                            className="h-24 w-full object-cover rounded-lg shadow-md"
                            alt={`Gallery ${idx + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setImageGallery((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Family Tree Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        Family Tree
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add family members: grandparents, parents, siblings,
                        spouses, children, grandchildren, etc.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={addFamilyMember}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Family Member
                    </Button>
                  </div>

                  {familyTree.length === 0 && (
                    <div className="text-center py-8 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
                      <Users className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                      <p className="text-blue-600 font-medium">
                        No family members added yet
                      </p>
                      <p className="text-sm text-blue-500 mt-1">
                        Click "Add Family Member" to start building the family
                        tree
                      </p>
                    </div>
                  )}

                  {familyTree.map((member, idx) => (
                    <Card key={idx} className="border-blue-200 bg-blue-50/50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-blue-900 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Family Member {idx + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFamilyMember(idx)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                              value={member.name}
                              onChange={(e) =>
                                updateFamilyMember(idx, "name", e.target.value)
                              }
                              placeholder="Enter full name"
                              className="bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Relationship to Deceased</Label>
                            <Select
                              value={member.relationship}
                              onValueChange={(value) =>
                                updateFamilyMember(idx, "relationship", value)
                              }
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                              <SelectContent>
                                {RELATIONSHIP_OPTIONS.map((relationship) => (
                                  <SelectItem
                                    key={relationship}
                                    value={relationship}
                                  >
                                    {relationship}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center space-x-2">
                          <Checkbox
                            id={`deceased-${idx}`}
                            checked={member.deceased}
                            onCheckedChange={(checked) =>
                              updateFamilyMember(idx, "deceased", !!checked)
                            }
                          />
                          <Label
                            htmlFor={`deceased-${idx}`}
                            className="text-sm"
                          >
                            This person is also deceased
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Service Setup */}
                <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Service Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addMemorialService("memorial")}
                      className="h-12 border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Memorial Service
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addMemorialService("burial")}
                      className="h-12 border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Burial Service
                    </Button>
                  </div>
                </div>

                {/* Memorial Services */}
                {memorialServices.map((service, idx) => (
                  <Card key={idx} className="border-blue-200">
                    <CardHeader className="bg-blue-50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-blue-900">
                          Memorial Service {idx + 1}
                        </CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeService("memorial", idx)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Venue</Label>
                          <Select
                            value={service.venue}
                            onValueChange={(value) =>
                              updateService("memorial", idx, "venue", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select venue" />
                            </SelectTrigger>
                            <SelectContent>
                              {VENUE_SUGGESTIONS.map((venue) => (
                                <SelectItem key={venue} value={venue}>
                                  {venue}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {service.venue === "Other" && (
                            <Input
                              placeholder="Enter custom venue"
                              onChange={(e) =>
                                updateService(
                                  "memorial",
                                  idx,
                                  "venue",
                                  e.target.value
                                )
                              }
                              className="mt-2"
                            />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={service.date}
                            onChange={(e) =>
                              updateService(
                                "memorial",
                                idx,
                                "date",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={service.time}
                            onChange={(e) =>
                              updateService(
                                "memorial",
                                idx,
                                "time",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Streaming Link (Optional)</Label>
                          <Input
                            value={service.streamingLink || ""}
                            onChange={(e) =>
                              updateService(
                                "memorial",
                                idx,
                                "streamingLink",
                                e.target.value
                              )
                            }
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Burial Services */}
                {burialServices.map((service, idx) => (
                  <Card key={idx} className="border-blue-200">
                    <CardHeader className="bg-blue-50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-blue-900">
                          Burial Service {idx + 1}
                        </CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeService("burial", idx)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Venue</Label>
                          <Select
                            value={service.venue}
                            onValueChange={(value) =>
                              updateService("burial", idx, "venue", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select venue" />
                            </SelectTrigger>
                            <SelectContent>
                              {VENUE_SUGGESTIONS.map((venue) => (
                                <SelectItem key={venue} value={venue}>
                                  {venue}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={service.date}
                            onChange={(e) =>
                              updateService(
                                "burial",
                                idx,
                                "date",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={service.time}
                            onChange={(e) =>
                              updateService(
                                "burial",
                                idx,
                                "time",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Streaming Link (Optional)</Label>
                          <Input
                            value={service.streamingLink || ""}
                            onChange={(e) =>
                              updateService(
                                "burial",
                                idx,
                                "streamingLink",
                                e.target.value
                              )
                            }
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Optional Sections */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="familyGathering"
                      className="text-base font-semibold"
                    >
                      Family Gathering / Planning Notes (Optional)
                    </Label>
                    <Textarea
                      id="familyGathering"
                      value={familyGatheringNotes}
                      onChange={(e) => setFamilyGatheringNotes(e.target.value)}
                      placeholder="Describe where friends and family are meeting..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="acknowledgements"
                      className="text-base font-semibold"
                    >
                      Acknowledgements (Optional)
                    </Label>
                    <Textarea
                      id="acknowledgements"
                      value={acknowledgements}
                      onChange={(e) => setAcknowledgements(e.target.value)}
                      placeholder="Write a message of thanks. This can be updated after the burial..."
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Publisher Details
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Information about the person creating this memorial
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="publisherName"
                      className="text-base font-semibold"
                    >
                      Publisher Name *
                    </Label>
                    <Input
                      id="publisherName"
                      value={publisherName}
                      onChange={(e) => setPublisherName(e.target.value)}
                      placeholder="First and last name"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">
                      Relationship with the Deceased *
                    </Label>
                    <Select
                      value={publisherRelationship}
                      onValueChange={setPublisherRelationship}
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {PUBLISHER_RELATIONSHIP_OPTIONS.map((relationship) => (
                          <SelectItem key={relationship} value={relationship}>
                            {relationship}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {publisherRelationship === "Other" && (
                      <Input
                        value={customPublisherRelationship}
                        onChange={(e) =>
                          setCustomPublisherRelationship(e.target.value)
                        }
                        placeholder="Specify relationship"
                        className="h-12 text-base mt-2"
                      />
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="publisherPhone"
                      className="text-base font-semibold"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="publisherPhone"
                      value={publisherPhone}
                      onChange={(e) => setPublisherPhone(e.target.value)}
                      placeholder="+254..."
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="publisherAlternatePhone"
                      className="text-base font-semibold"
                    >
                      Alternate Phone Number (Optional)
                    </Label>
                    <Input
                      id="publisherAlternatePhone"
                      value={publisherAlternatePhone}
                      onChange={(e) =>
                        setPublisherAlternatePhone(e.target.value)
                      }
                      placeholder="+254..."
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="publisherEmail"
                    className="text-base font-semibold"
                  >
                    Email *
                  </Label>
                  <Input
                    id="publisherEmail"
                    type="email"
                    value={publisherEmail}
                    onChange={(e) => setPublisherEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">
                    Preferred Method of Contact
                  </Label>
                  <Select
                    value={preferredContact}
                    onValueChange={(value: any) => setPreferredContact(value)}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms_call">SMS/Call</SelectItem>
                      <SelectItem value="whatsapp">
                        WhatsApp/Chat/Call
                      </SelectItem>
                      <SelectItem value="email_only">Email only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment & Publishing Preferences
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Complete your memorial setup
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Payment Instructions */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold mb-4 text-blue-900 text-lg">
                    Payment Instructions
                  </h4>
                  <div className="space-y-3 text-sm">
                    <p className="text-blue-800">
                      <strong>Memorial Publishing Fee:</strong> KES 25,000 per
                      year
                    </p>
                    <p className="text-blue-800">
                      <strong>Payment Method:</strong> M-Pesa Till{" "}
                      <span className="font-mono bg-white px-2 py-1 rounded">
                        781086
                      </span>{" "}
                      – RoundSquare Marketing
                    </p>
                    <p className="text-blue-800">
                      <strong>Extended Options:</strong> Pay for up to 3 years
                      in advance
                    </p>
                  </div>

                  <div className="mt-6 space-y-2">
                    <Label className="text-base font-semibold text-blue-900">
                      Payment Duration
                    </Label>
                    <Select
                      value={paymentYears.toString()}
                      onValueChange={(value) =>
                        setPaymentYears(Number.parseInt(value))
                      }
                    >
                      <SelectTrigger className="h-12 text-base bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          <div className="flex justify-between items-center w-full">
                            <span>1 Year</span>
                            <Badge variant="secondary" className="ml-4">
                              KES 25,000
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="2">
                          <div className="flex justify-between items-center w-full">
                            <span>2 Years</span>
                            <Badge variant="secondary" className="ml-4">
                              KES 50,000
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="3">
                          <div className="flex justify-between items-center w-full">
                            <span>3 Years</span>
                            <Badge variant="secondary" className="ml-4">
                              KES 75,000
                            </Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="mpesaCode"
                    className="text-base font-semibold"
                  >
                    M-Pesa Confirmation Code *
                  </Label>
                  <Input
                    id="mpesaCode"
                    value={mpesaCode}
                    onChange={(e) => setMpesaCode(e.target.value)}
                    placeholder="e.g., QWE12ABC34"
                    className="h-12 text-base font-mono"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the confirmation code you received after making the
                    M-Pesa payment
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="allowTributes"
                      checked={allowPublicTributes}
                      onCheckedChange={(checked) =>
                        setAllowPublicTributes(!!checked)
                      }
                    />
                    <Label
                      htmlFor="allowTributes"
                      className="text-base font-medium"
                    >
                      Enable public tribute messages
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 ml-7">
                    Allow visitors to leave tribute messages on the memorial
                    page
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border">
                  <h4 className="font-semibold mb-4 text-gray-900">
                    Publisher Acknowledgement
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="acknowledgement"
                        checked={publisherAcknowledgement}
                        onCheckedChange={(checked) =>
                          setPublisherAcknowledgement(!!checked)
                        }
                      />
                      <div className="space-y-2">
                        <Label
                          htmlFor="acknowledgement"
                          className="text-sm font-medium leading-relaxed"
                        >
                          I confirm and acknowledge the following:
                        </Label>
                        <ul className="text-sm text-gray-600 space-y-1 ml-4">
                          <li>• The accuracy of all information provided</li>
                          <li>• I have the rights to publish this memorial</li>
                          <li>
                            • I understand the memorial will be published for
                            the selected duration
                          </li>
                          <li>
                            • I am responsible for downloading any tributes
                            before expiration
                          </li>
                          <li>• I understand the renewal options and terms</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8">
            <Button
              variant="outline"
              disabled={step === 1}
              onClick={() => setStep((s) => s - 1)}
              className="h-12 px-8 text-base border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Back
            </Button>
            {step < 4 ? (
              <Button
                onClick={() => canNext && setStep((s) => s + 1)}
                disabled={!canNext}
                className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={onSubmit}
                disabled={!canNext || saving}
                className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Memorial"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
