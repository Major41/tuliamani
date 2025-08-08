import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          <Image
            src="/logo.avif"
            alt="Tuliamani Logo"
            width={100}
            height={50}
          />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/memorials"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Memorials
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Services
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
