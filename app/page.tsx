import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Shield,
  Clock,
  Users,
  BookOpen,
  Camera,
  MessageCircle,
  Download,
  Archive,
  Megaphone,
  Images,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-svh flex flex-col">
      <SiteHeader />
      {/* Hero Section */}
      <section className="relative py-8 lg:py-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Heart className="w-3 h-3 mr-1" />
                  Celebrate life by sharing memories.
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Your Digital Sanctuary{" "}
                  <span className="text-primary">for Remembrance</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Create a lasting memorial to celebrate your loved one. Share
                  memories and gather tributes to preserve their legacy, and
                  begin healing together.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/obituaries/new">
                  <Button size="lg" className="w-full sm:w-auto">
                    Create Obituary
                  </Button>
                </Link>
                <Link href="/memorials">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Explore Memorials
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20">
                <img
                  alt="Memorial showcase"
                  className="w-full h-full object-cover rounded-xl"
                  src="/hero.jpg?height=500&width=800"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-background border rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Always Remembered</div>
                    <div className="text-sm text-muted-foreground">
                      Forever in our hearts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need to Honor a Life
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tuliamani provides the tools and support to create meaningful
              memorials, share important updates, and preserve treasured
              memories that last.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Megaphone className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Announcement</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Share death and funeral announcements with ease, keeping
                  family and friends informed with a respectful obituary.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Tribute Messages</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Invite friends and family to share memories, heartfelt stories
                  and condolences, creating a rich legacy of love.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Legacy Books</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Create a beautifully designed legacy book that captures your
                  loved one’s essence, preserving their story for generations.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Images className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Lasting Memorials</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Build a peaceful memorial space filled with photos, tributes
                  and reflections, a place to return to, honour and remember.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <!-- Header --> */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How Publishing on Tuliamani Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              It is easy to create and publish an obituary or memorial. An
              obituary is for families actively planning a funeral or burial
              while a memorial is for families and friends honouring a loved one
              already laid to rest.
            </p>
          </div>

          {/* <!-- Process Steps --> */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* <!-- Step 1 --> */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">
                Create
              </h3>
              <p className="text-gray-600 text-center">
                Write the obituary or memorial story, add photos, family tree
                and funeral details for the obituary.
              </p>
            </div>

            {/* <!-- Step 2 --> */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">
                Review
              </h3>
              <p className="text-gray-600 text-center">
                We ensure your obituary or memorial is published with care,
                respect and sensitivity.
              </p>
            </div>

            {/* <!-- Step 3 --> */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">
                Share
              </h3>
              <p className="text-gray-600 text-center">
                Invite family and friends to add stories, reflections and give
                tributes to preserve the legacy.
              </p>
            </div>
          </div>

          {/* <!-- Explanation Cards --> */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* <!-- Obituaries Card --> */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-600">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Obituaries
                </h3>
              </div>
              <p className="text-gray-600 mb-3 italic">
                For families actively planning a funeral or burial.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-teal-600 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Write the obituary, add funeral details including program
                    and streaming links
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-teal-600 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Upload photos, eulogy, and family tree</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-teal-600 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Keep friends and family updated, invite tributes, and gather
                    support
                  </span>
                </li>
              </ul>
            </div>

            {/* <!-- Memorials Card --> */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Memorials
                </h3>
              </div>
              <p className="text-gray-600 mb-3 italic">
                For families and friends honouring a loved one already laid to
                rest.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-600 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Share their memorial story, upload photos, family tree and
                    the eulogy
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-600 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Capture cherished memories and moments</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-600 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Gather more tributes, reflections, and stories to preserve
                    their legacy
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Funeral Service Directory
              </h2>
              <p className="text-lg text-muted-foreground">
                Find trusted funeral service providers to support you during
                life’s most difficult moments. From funeral homes to floral
                arrangements, Tuliamani helps connect you with providers who can
                meet your needs.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Funeral Homes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Caskets & Urns</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Flowers & Arrangements</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Live Streaming</span>
                </div>
              </div>
              <Link href="/directory">
                <Button>Browse Services</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="w-full h-32 relative">
                    <Image
                      src="/placeholder.jpg"
                      alt="Funeral Homes"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h4 className="font-semibold mt-3">
                    Peaceful Gardens Funeral Home
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Full service funeral home
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="w-full h-32 relative">
                    <Image
                      src="/placeholder.jpg"
                      alt="Flowers & Arrangements"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h4 className="font-semibold mt-3">Eternal Flowers</h4>
                  <p className="text-sm text-muted-foreground">
                    Sympathy arrangements
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="w-full h-32 relative">
                    <Image
                      src="/placeholder.jpg"
                      alt="Live Streaming"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h4 className="font-semibold mt-3">Memorial Streaming</h4>
                  <p className="text-sm text-muted-foreground">
                    Live ceremony broadcasts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="w-full h-32 relative">
                    <Image
                      src="/placeholder.jpg"
                      alt="Caskets & Urns"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h4 className="font-semibold mt-3">Heritage Caskets</h4>
                  <p className="text-sm text-muted-foreground">
                    Quality caskets & urns
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Start Preserving Memories Today
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Honour your loved one’s journey with a timeless tribute to celebrate
            a life beautifully lived. . Create a Digital Memorial for online
            remembrances, or a Legacy Book to pass down their story for
            generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/directory">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Create Your First Memorial
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary-foreground text-gray-900 hover:bg-primary-foreground hover:text-primary"
              >
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
