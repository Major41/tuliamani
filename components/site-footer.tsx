import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tuliamani</h3>
            <p className="text-sm text-muted-foreground">
              Preserving memories and honoring lives with dignity and care.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Platform</h4>
            <div className="space-y-2 text-sm">
              <Link href="/memorials" className="block hover:text-primary">
                Memorials
              </Link>
              <Link href="/services" className="block hover:text-primary">
                Services
              </Link>
              <Link href="/blog" className="block hover:text-primary">
                Blog
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Company</h4>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block hover:text-primary">
                About
              </Link>
              <Link href="/contact" className="block hover:text-primary">
                Contact
              </Link>
              <Link href="/privacy" className="block hover:text-primary">
                Privacy
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Support</h4>
            <div className="space-y-2 text-sm">
              <Link href="/help" className="block hover:text-primary">
                Help Center
              </Link>
              <Link href="/guides" className="block hover:text-primary">
                Guides
              </Link>
              <Link href="/contact" className="block hover:text-primary">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Tuliamani. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
