import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Heart,
  Users,
  Shield,
  Clock,
  Award,
  Globe,
  BookOpen,
  Star,
  Lock,
  CheckCircle,
} from "lucide-react";
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
            Tuliamani is a sanctuary to honour loved ones with grace, where
            memories are preserved, legacies endure, and remembrance brings
            lasting connection.
          </p>
        </div>
      </section>

      {/* Celebrate, Remember, and Preserve Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Celebrate, Remember, and Preserve
              </h2>
              <p className="text-lg text-muted-foreground">
                Celebrate and honour your loved one by sharing memories and
                preserving their legacy through a lasting tribute that brings
                comfort and connection for generations.
              </p>
              <p className="text-lg text-muted-foreground">
                Use Tuliamani as your digital sanctuary for remembrance, where
                stories, photos, and heartfelt tributes come together. Here,
                remembrance becomes a celebration, connection becomes a path to
                healing, and love endures through the legacies we preserve.
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

      {/* Tribute Types Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Types of Tributes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you are actively planning a burial service or reflecting
              on a life already laid to rest, you can easily create and publish
              the right tribute
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  Obituary Tribute
                </CardTitle>
                <CardDescription className="italic">
                  For families actively planning a funeral or burial.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Share funeral details and service information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Create a supportive space for condolences and tributes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Keep friends and family updated with all arrangements
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-green-500" />
                  Memorial Tribute
                </CardTitle>
                <CardDescription className="italic">
                  For families and friends honouring a loved one already at
                  rest.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Build a beautiful online space to celebrate their life
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Gather memories retroactively from loved ones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Preserve their legacy for future generations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground">
              In both, you can invite family and friends to share stories,
              photos, and heartfelt messages, building a collective tribute that
              preserves a legacy with dignity.
            </p>
          </div>
        </div>
      </section>

      {/* Digital Sanctuary Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                A Digital Sanctuary That Lasts
              </h2>
              <p className="text-lg text-muted-foreground">
                Tuliamani provides a serene, dedicated space where you can
                manage everything in one place. Over time, these shared memories
                can be transformed into a Legacy Book, a permanent, printable
                keepsake of love and remembrance.
              </p>
              <p className="text-lg text-muted-foreground">
                Every tribute is placed in the Memorial Sanctuary, a lasting
                place of peace to return to whenever you wish to reflect and
                reconnect.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link href="/create-tribute">
                  <Button>Create a Tribute</Button>
                </Link>
                <Link href="/create-memorial">
                  <Button variant="outline">Create a Memorial</Button>
                </Link>
                <Link href="/legacy-books">
                  <Button variant="outline">Explore Legacy Books</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                alt="Digital sanctuary illustration"
                className="w-full h-80 object-cover rounded-xl shadow-lg"
                src="/placeholder.svg?height=320&width=480"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Tuliamani Exists Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 space-y-8">
          <h2 className="text-3xl font-bold text-center">
            Why Tuliamani Exists
          </h2>
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <p>
              Tuliamani was born from a simple belief: remembering together
              brings comfort, and healing begins when we feel supported.
            </p>
            <p>
              In times of loss, communication is often overwhelming. Despite all
              the technology and options available today, messages become
              scattered across social media platforms; newspaper notices are
              costly for many; vernacular stations are limited by language and
              geography; and printing entire programmes with full eulogies is
              often too expensive. As a result, precious memories risk being
              lost forever.
            </p>
            <p>
              Tuliamani is a calm, focused alternative: a dedicated digital
              sanctuary where families and communities come together in one
              place of care.
            </p>
            <p>
              Here, remembrance is lasting. It is neither fleeting nor fractured
              across generations and channels, but connected and preserved.
              Stories, photos, and tributes weave together a tapestry of legacy
              that honours not just the loss, but the life lived.
            </p>
            <p>
              In times of loss, families, friends, and communities are welcome
              to use this space to announce a funeral through an obituary or to
              honour and celebrate a life through a memorial. Tuliamani will
              publish their tributes and help preserve those legacies with
              dignity and love.
            </p>
            <p className="font-semibold">
              Tuliamani exists to help you hold onto what matters.
            </p>
            <ul className="list-none space-y-2">
              <li className="flex items-start gap-2">
                <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Because when we remember together, we heal.</span>
              </li>
              <li className="flex items-start gap-2">
                <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Because telling their story honours their life.</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  And because love deserves to be preserved, gently,
                  meaningfully, and forever.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Tuliamani Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Why Choose Tuliamani?</h2>
            <p className="text-lg text-muted-foreground">
              We have thoughtfully designed every feature with your needs in
              mind, offering a compassionate alternative to the challenges of
              modern remembrance.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    A Unified, Centralised Space
                  </h3>
                  <p className="text-muted-foreground">
                    Gather everyone into one dedicated, serene space. Avoid the
                    stress of fractured messages across social media, group
                    chats, and email, ensuring no precious memory or condolence
                    is ever lost.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Truly Accessible & Affordable
                  </h3>
                  <p className="text-muted-foreground">
                    Honour your loved one without financial burden. We provide a
                    dignified alternative to costly newspaper notices, limited
                    vernacular announcements, and expensive printed programmes.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Robust Privacy & Security
                  </h3>
                  <p className="text-muted-foreground">
                    We do not require sign-ups to view tributes, and publishers
                    can choose to keep their pages private. Your memories are
                    protected with enterprise-grade security and privacy
                    controls you can trust.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Thoughtful Curation</h3>
                  <p className="text-muted-foreground">
                    We review every obituary and memorial tribute before
                    publishing to gently guide families and ensure the highest
                    standard of respect and dignity.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Lasting Preservation</h3>
                  <p className="text-muted-foreground">
                    We ensure your loved one's memorial is preserved with
                    dignity for one full year. After this period, you can choose
                    to extend the preservation in annual increments.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Award className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Professional, Personal Service
                  </h3>
                  <p className="text-muted-foreground">
                    From Legacy Books to memorial design, we maintain the
                    highest standards of quality and craftsmanship. Our team
                    handles every aspect personally and takes all feedback
                    seriously.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
