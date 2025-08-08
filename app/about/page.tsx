import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, Users, Shield, Clock, Award, Globe } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function AboutPage() {
  return (
    <main className="min-h-svh">
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold">About Tuliamani</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We believe every life deserves to be remembered with dignity, love,
            and respect. Tuliamani provides a sacred digital space where
            memories live on and legacies are preserved for future generations.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                To create a compassionate platform that honors the departed,
                supports the grieving, and preserves precious memories for
                generations to come. We understand that grief is a journey, and
                we're here to help you navigate it with grace and dignity.
              </p>
              <p className="text-lg text-muted-foreground">
                Every memorial on Tuliamani is more than just a digital
                tribute—it's a celebration of a life lived, a story told, and a
                legacy preserved.
              </p>
            </div>
            <div className="relative">
              <img
                alt="Peaceful memorial setting"
                className="w-full h-80 object-cover rounded-xl shadow-lg"
                src="/placeholder.svg?height=320&width=480"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at Tuliamani
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Compassion</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We approach every memorial with empathy, understanding the
                  deep emotions involved in honoring a loved one.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Respect</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every life story is sacred. We treat each memorial with the
                  utmost respect and dignity it deserves.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Grief is easier when shared. We foster a supportive community
                  where memories and comfort are shared.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Permanence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Memories should last forever. We're committed to preserving
                  legacies for future generations.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We strive for excellence in every aspect of our service, from
                  design to customer support.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Everyone deserves to honor their loved ones, regardless of
                  location or circumstances.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-8">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <div className="prose prose-lg dark:prose-invert mx-auto text-left">
            <p>
              Tuliamani was born from a deeply personal experience. When our
              founder lost a beloved family member, they struggled to find a
              meaningful way to preserve and share precious memories with
              extended family and friends scattered across the globe.
            </p>
            <p>
              Traditional obituaries felt limiting, and social media posts
              seemed too temporary for something so important. There had to be a
              better way—a more dignified, permanent, and beautiful way to honor
              those we've lost.
            </p>
            <p>
              That's when the vision for Tuliamani was born. Named after the
              Swahili phrase meaning "to remember," our platform combines the
              permanence of traditional memorials with the connectivity and
              richness of digital media.
            </p>
            <p>
              Today, we're proud to serve families around the world, helping
              them create lasting tributes that celebrate life, preserve
              memories, and bring comfort during difficult times.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Why Choose Tuliamani?</h2>
            <p className="text-lg text-muted-foreground">
              We've thoughtfully designed every feature with your needs in mind
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Thoughtful Design</h3>
                  <p className="text-muted-foreground">
                    Every element is designed with sensitivity and respect,
                    creating beautiful memorials that honor your loved one.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Privacy & Security</h3>
                  <p className="text-muted-foreground">
                    Your memories are protected with enterprise-grade security
                    and privacy controls you can trust.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Community Support</h3>
                  <p className="text-muted-foreground">
                    Connect with others who understand your journey and find
                    comfort in shared experiences.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Lasting Preservation</h3>
                  <p className="text-muted-foreground">
                    Memorials are preserved permanently, ensuring future
                    generations can connect with their heritage.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Award className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Professional Quality</h3>
                  <p className="text-muted-foreground">
                    From legacy books to memorial design, we maintain the
                    highest standards of quality and craftsmanship.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Global Accessibility</h3>
                  <p className="text-muted-foreground">
                    Share memorials with family and friends anywhere in the
                    world, bringing everyone together in remembrance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-8">
          <h2 className="text-3xl font-bold">Ready to Honor Your Loved One?</h2>
          <p className="text-xl opacity-90">
            Join the Tuliamani community and create a lasting tribute that
            celebrates a life well-lived.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Create Your Memorial Today
            </Button>
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
