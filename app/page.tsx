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
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-svh flex flex-col">
      <SiteHeader />
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
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
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">
                    Memorials Created
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-muted-foreground">
                    Tributes Shared
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">99%</div>
                  <div className="text-sm text-muted-foreground">
                    Satisfaction Rate
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8">
                <img
                  alt="Memorial showcase"
                  className="w-full h-full object-cover rounded-xl shadow-2xl"
                  src="/hero.jpg?height=600&width=600"
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
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Photo Galleries</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Upload and organize cherished photos to create beautiful
                  visual tributes.
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
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Your memories are safe with enterprise-grade security and
                  privacy controls.
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
                  <Image
                    src="homes.jpg"
                    alt="Funeral Homes"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm">Funeral Homes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/casket.jpeg"
                    alt="Caskets & Urns"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm">Caskets & Urns</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/11432032.png"
                    alt="Flowers & Arrangements"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm">Flowers & Arrangements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/stream.jpg"
                    alt="Live Streaming"
                    width={24}
                    height={24}
                  />
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
                  <Image
                    src="homes.jpg"
                    alt="Funeral Homes"
                    width={24}
                    height={24}
                  />
                  <h4 className="font-semibold">
                    Peaceful Gardens Funeral Home
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Full service funeral home
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  {/* <div className="w-full h-24 bg-muted rounded-md mb-3"></div> */}
                  <Image
                    src="/11432032.png"
                    alt="Flowers & Arrangements"
                    width={24}
                    height={24}
                  />
                  <h4 className="font-semibold">Eternal Flowers</h4>
                  <p className="text-sm text-muted-foreground">
                    Sympathy arrangements
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Image
                    src="/stream.jpg"
                    alt="Live Streaming"
                    width={24}
                    height={24}
                  />
                  <h4 className="font-semibold">Memorial Streaming</h4>
                  <p className="text-sm text-muted-foreground">
                    Live ceremony broadcasts
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Image
                    src="/casket.jpeg"
                    alt="Caskets & Urns"
                    width={24}
                    height={24}
                  />
                  <h4 className="font-semibold">Heritage Caskets</h4>
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
            <Link href="/signup">
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
                className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
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
