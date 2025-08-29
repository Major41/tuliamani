import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Heart,
  Users,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  FileText,
  Image,
  Star,
  Phone,
  MessageCircle,
  Flower,
  Video,
  Printer,
  HeartHandshake,
} from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-muted-foreground">
            At Tuliamani, we believe every life deserves to be honoured with
            dignity, care, and remembrance.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-lg text-muted-foreground">
            We provide four key services to help families preserve memories,
            celebrate legacies, and find trusted support during life's most
            difficult moments.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 space-y-20">
          {/* Obituaries & Announcements */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold">
                  1. Obituaries & Announcements
                </h2>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">What It Is</h3>
                <p className="text-blue-700">
                  A centralised Obituary Page where you can share funeral and
                  burial details with ease and grace. This eliminates the need
                  for scattered calls, texts, or social media posts. The page
                  also provides a supportive space for tributes and condolences,
                  while preserving stories that can later be woven into a Legacy
                  Book.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Why Use Tuliamani?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Central hub for funeral service details</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Option to upload programmes, eulogies, or streaming links
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Supportive space for tributes and condolences</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Ability to update family tree and biography over time
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Stories preserved for later inclusion in a Legacy Book
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">How It Works</h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    Prepare: Gather announcement text, details of the deceased,
                    funeral plans (venue, timings), initial eulogy, immediate
                    family tree, and at least one portrait photo.
                  </li>
                  <li>
                    Submit: Visit the Create a Tribute page, enter the details,
                    upload the photo, complete publisher information, and make
                    payment.
                  </li>
                  <li>
                    Set Tribute Preferences: Choose whether tributes are public
                    (visible to all) or private (visible only to you).
                  </li>
                  <li>
                    Review & Publish: Tuliamani reviews the submission, then
                    publishes and alerts you.
                  </li>
                  <li>
                    Share: Use the unique link to announce the passing and
                    invite family and friends.
                  </li>
                  <li>
                    Update: Return at any time to update funeral details,
                    acknowledgements, family tree, or biography.
                  </li>
                  <li>
                    Curate: Select tributes and memories for inclusion in a
                    future Legacy Book.
                  </li>
                </ol>
              </div>

              <Button className="mt-6">
                Create an Obituary
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-xl h-full">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-4">Quick Facts</h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-500 mr-3" />
                    <span>Published within 2 hours of submission</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-blue-500 mr-3" />
                    <span>Privacy controls for tributes</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-500 mr-3" />
                    <span>Centralized space for family and friends</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 text-blue-500 mr-3" />
                    <span>Compatible with Legacy Book creation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Curated Memorials */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="order-2 md:order-1">
              <div className="bg-gradient-to-br from-green-100 to-blue-100 p-8 rounded-xl h-full">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-semibold mb-4">Memorial Features</h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Image className="w-5 h-5 text-green-500 mr-3" />
                      <span>Photo gallery with up to 5 images</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 text-green-500 mr-3" />
                      <span>Space for stories and tributes</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-green-500 mr-3" />
                      <span>Collaborative memorial building</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 text-green-500 mr-3" />
                      <span>Can be converted to Legacy Book</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 order-1 md:order-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold">2. Curated Memorials</h2>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  What It Is
                </h3>
                <p className="text-green-700">
                  A Memorial Page honours your loved one's life with a lasting
                  digital sanctuary. Memorials can be created immediately or
                  long after the funeral, giving families space to reflect and
                  gather tributes. This collaborative space allows family and
                  friends to share photos, stories, and updates—building a
                  tapestry of memory and legacy that can be revisited for
                  generations.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Why Use Tuliamani?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Collect and preserve stories, tributes, and photos
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Create a collaborative memorial that grows over time
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Option to transform memories into a Legacy Book</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Return anytime to reflect, remember, and heal</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">How It Works</h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    Prepare: Write the memorial story, include the original
                    eulogy if available, and update the family tree.
                  </li>
                  <li>
                    Submit: Go to the Create a Memorial page. Enter the details,
                    upload a portrait and up to five gallery photos, complete
                    your details, and pay to publish.
                  </li>
                  <li>
                    Review & Publish: Tuliamani reviews, publishes, and notifies
                    you.
                  </li>
                  <li>
                    Set Tribute Preferences: Choose whether tributes are public
                    or private.
                  </li>
                  <li>
                    Share: Invite loved ones to contribute memories using the
                    memorial link.
                  </li>
                  <li>
                    Update: Add more stories, photos, or updates at any time.
                  </li>
                </ol>
              </div>

              <Button className="mt-6">
                Create a Memorial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Legacy Books */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-3xl font-bold">3. Legacy Books</h2>
              </div>

              <div className="bg-amber-50 p-6 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">
                  What It Is
                </h3>
                <p className="text-amber-700">
                  A Legacy Book is a carefully curated, print-ready keepsake
                  that weaves together stories, tributes, and photographs into a
                  timeless heirloom. Designed with care, it celebrates your
                  loved one's story and preserves their legacy for future
                  generations.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">What We Offer</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <span>
                      Standard Package: 48-page A4 Legacy Book (cover + 3
                      revision rounds) – KES 50,000
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <span>
                      Option to original writing, editing and typesetting
                      dedicated content – KES 40,000
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <span>Extra pages – KES 1,500 each</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <span>
                      Delivered as a polished, print-ready PDF with printing
                      guidance
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">How It Works</h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    Order & Pay: Fill out the online order form and make payment
                    via M-PESA or online. You'll receive a secure upload link.
                  </li>
                  <li>
                    Gather Content: Collect tributes and photos from your
                    Tuliamani memorial page or offline sources.
                  </li>
                  <li>
                    Submit Materials: Upload all text and images, along with
                    design preferences.
                  </li>
                  <li>
                    Collaborate on Design: Work through a structured 17-day
                    review process.
                  </li>
                  <li>
                    If editing or content generation support is required, add +6
                    days to the timeline.
                  </li>
                </ol>
              </div>

              <div className="flex gap-4 mt-6">
                <Button>
                  Order Your Legacy Book
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline">See Pricing Guide</Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-8 rounded-xl h-full">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-4">Process Timeline</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Days 1–5</span>
                    <span className="font-medium">
                      Content review & text draft
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Days 6–8</span>
                    <span className="font-medium">Draft 1 review</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Days 9–10</span>
                    <span className="font-medium">Full layout with edits</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Days 11–13</span>
                    <span className="font-medium">
                      Family review of full draft
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Days 14–16</span>
                    <span className="font-medium">Final tweaks</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span>Day 17</span>
                    <span className="font-medium">Final delivery</span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  * Add +6 days if editing or content generation support is
                  required
                </div>
              </div>
            </div>
          </div>

          {/* Funeral Service Directory */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold">Funeral Service Directory</h2>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg mb-8">
              <p className="text-purple-700">
                Discover compassionate funeral service providers who can to
                support you during life's most difficult moments.
              </p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Important Note
              </h3>
              <p className="text-yellow-700">
                While we verify that all providers listed here exist and provide
                the services described in their profile, we do not validate the
                quality of their services or endorse them. Families are
                encouraged to engage directly with providers to determine
                suitability and level of care.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-4">Services Available</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-white rounded-lg border">
                  <Users className="w-5 h-5 text-purple-500 mr-3" />
                  <span>
                    Funeral Homes – Guidance and support to plan dignified
                    services.
                  </span>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg border">
                  <Heart className="w-5 h-5 text-purple-500 mr-3" />
                  <span>
                    Caskets & Urns – Options to honour your loved one.
                  </span>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg border">
                  <Flower className="w-5 h-5 text-purple-500 mr-3" />
                  <span>
                    Flowers & Arrangements – Floral tributes for the service and
                    beyond.
                  </span>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg border">
                  <Video className="w-5 h-5 text-purple-500 mr-3" />
                  <span>
                    Live Streaming – Connect family and friends unable to attend
                    in person.
                  </span>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg border">
                  <Printer className="w-5 h-5 text-purple-500 mr-3" />
                  <span>
                    Printing of funeral programs, banners, portrait photos &
                    memorabilia
                  </span>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg border">
                  <MessageCircle className="w-5 h-5 text-purple-500 mr-3" />
                  <span>Counselling and grief support</span>
                </div>
              </div>
            </div>

            <Button className="mb-12">
              Browse Services and connect with providers in your area
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            {/* For Service Providers */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle>For Service Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Tuliamani partners with verified funeral and compassionate
                  care providers. Listings are vetted to meet our standards of
                  dignity and care, ensuring families can find reliable support.
                </p>

                <h4 className="font-semibold mb-3">Process to Get Listed:</h4>
                <ol className="list-decimal pl-6 space-y-2 mb-4">
                  <li>
                    Submit your details via the Join as a Service Provider form.
                  </li>
                  <li>Pay the annual listing fee of KES 3,000.</li>
                  <li>Attend a short verification call with Tuliamani.</li>
                  <li>
                    Once approved, your listing will go live within one business
                    day (or the next day if submitted after 5:00 pm).
                  </li>
                </ol>

                <Button variant="outline">Join as a Service Provider</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Tuliamani is your digital sanctuary for remembrance
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Every life has a story worth preserving. With Tuliamani, remembrance
            becomes a path to healing, and love becomes a legacy that lasts
            forever.
          </p>
          <Button size="lg">
            Start Preserving Memories Today
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
