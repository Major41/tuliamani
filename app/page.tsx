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
                  Preserving Memories
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Honor Lives,{" "}
                  <span className="text-primary">Preserve Legacies</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Create beautiful digital memorials and obituaries. Share
                  memories, collect tributes, and keep legacies alive for
                  generations to come.
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
              Our platform provides all the tools to create meaningful memorials
              and preserve precious memories.
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
                  Share important announcements and updates with family and
                  friends.
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
                  Allow friends and family to share memories and condolences.
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
                  Create beautiful printed books to preserve memories forever.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Images className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Annual Memories</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Create a space for annual memories and reflections to honor
                  your loved ones.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              How Tuliamani Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Creating a memorial is simple and meaningful
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Create Your Tribute</h3>
              <p className="text-muted-foreground">
                Share the story, upload photos, and add funeral details in our
                easy-to-use form.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Admin Review</h3>
              <p className="text-muted-foreground">
                Our team reviews and publishes your tribute with care and
                respect.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Share & Preserve</h3>
              <p className="text-muted-foreground">
                Invite others to contribute memories and preserve the legacy
                forever.
              </p>
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
                Find trusted funeral service providers in your area. From
                funeral homes to flowers, we connect you with verified
                professionals during difficult times.
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
              <Link href="/services">
                <Button>Browse Services</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="w-full h-32 relative">
                    <Image
                      src="/homes.jpg"
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
                      src="/11432032.png"
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
                      src="/stream.jpg"
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
                      src="/casket.jpeg"
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
            Join thousands of families who trust Tuliamani to honor their loved
            ones and preserve their legacies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
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
