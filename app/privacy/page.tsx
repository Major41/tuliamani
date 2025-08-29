import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Mail, Phone, MessageSquare } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <Shield className="mr-2 h-6 w-6" />
              <CardTitle>What We Collect</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    Publisher details: Name, email, phone, and relationship to
                    the deceased.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    Memorial content: Stories, tributes, photos submitted
                    voluntarily.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>Payment data: Retained only for accounting.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    To create, publish, and manage your obituary, memorial, or
                    order.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    To contact you if clarification or support is needed.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>To process payments securely.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What We Don't Do</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    We never sell or share your personal information for
                    marketing.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>We never repurpose or resell memorial content.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    You control what is published and who can contribute.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    You may update, edit, or request removal of your content at
                    any time.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    Tribute pages are accessible only via unique links and are
                    not indexed on search engines.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Mission Statement */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <p className="italic text-center">
                Tuliamani exists to walk gently with families through grief and
                remembrance. We provide the structure — but the love, the words,
                and the memories come from you. Your stories remain yours.
                Always.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <div className="mt-8 pt-8 border-t">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>How to Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-lg border">
                    <Mail className="h-10 w-10 mx-auto mb-3 text-blue-500" />
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-muted-foreground">
                      tuliamanisantuary@gmail.com
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <Phone className="h-10 w-10 mx-auto mb-3 text-green-500" />
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <p className="text-muted-foreground">+254 722 634 269</p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3 text-purple-500" />
                    <h3 className="font-semibold mb-2">WhatsApp</h3>
                    <p className="text-muted-foreground">+254 722 634 269</p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground">
                    Quick contact form for support available on our website.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
