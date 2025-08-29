import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Mail, Phone, MessageSquare } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Use</h1>
          <p className="text-xl text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          <Card>
            <CardHeader>
              <CardTitle>1. Responsible & Respectful Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Tuliamani is a platform for remembrance. Users must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Share accurate, compassionate, and respectful content.</li>
                <li>Publish only material they own or have rights to use.</li>
                <li>Avoid offensive, misleading, or harmful material.</li>
              </ul>
              <p>
                Content violating these principles may be removed by Tuliamani
                or at the family's request.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Content Ownership & Accuracy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    All tributes, stories, and images remain the property of the
                    publisher/family.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    Tuliamani does not claim ownership, only the right to host
                    and display them.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>Publishers are responsible for ensuring accuracy.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    Our review is limited to formatting, dignity, and compliance
                    with community values — not fact-checking.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Submissions, Updates & Duration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    Obituaries & Memorials: Approved pages go live immediately
                    and remain active for 1 year. They can be renewed or
                    archived indefinitely in read-only mode.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    Edits: Publishers may update content (details, tributes,
                    photos, acknowledgements) at any time.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    Timeline: Submissions received before 8:00 pm EAT are
                    reviewed within 2 hours of payment. Later submissions are
                    reviewed the next morning.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Legacy Books</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>Delivered as a print-ready PDF.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>Families review before printing.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    Extra services (editing, extended revisions, photo sorting)
                    may incur additional costs.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Funeral Service Providers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    Tuliamani verifies that providers exist and offer listed
                    services.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>We do not guarantee service quality or outcomes.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>Families engage providers directly.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Payments & Fees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    All fees are transparent and clearly stated upfront.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>Payments are processed securely.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>
                    Records (e.g., M-Pesa confirmation codes) are retained only
                    for accounting.
                  </span>
                </li>
              </ul>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
