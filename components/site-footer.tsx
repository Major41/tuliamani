import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-primary mb-4">
              <Image
                src="/logo.avif"
                alt="Tuliamani Logo"
                width={100}
                height={50}
              />
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
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
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+1234567890" className="hover:text-primary">
                  +254 722 634269
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:info@tuliamani.com"
                  className="hover:text-primary"
                >
                  placeholder@gmail.com
                </a>
              </div>
              <Link href="/contact" className="block hover:text-primary pt-2">
                Contact Form
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
