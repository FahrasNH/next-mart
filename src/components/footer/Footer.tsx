import Link from "next/link";
import { Facebook, Twitter, Youtube } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#catalog", label: "Inventory" },
  { href: "#financing", label: "Financing" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer
      id="contact"
      className="mt-auto scroll-mt-24 bg-[#0a1628] py-12 text-white sm:py-14"
    >
      {/* Anchor targets for in-page nav (no visible block) */}
      <span id="financing" className="sr-only" aria-hidden>
        Financing
      </span>
      <span id="blog" className="sr-only" aria-hidden>
        Blog
      </span>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          {/* Brand + copyright */}
          <div className="shrink-0 text-center lg:text-left">
            <p className="text-lg font-bold tracking-tight text-white">
              NextMart
            </p>
            <p className="mt-2 text-sm font-normal text-white/55">
              © 2026 NextMart. All rights reserved.
            </p>
          </div>

          {/* Navigation */}
          <nav
            className="flex flex-1 flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-normal text-white lg:gap-x-10"
            aria-label="Footer"
          >
            {navItems.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="transition hover:text-white/90 hover:underline"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Social */}
          <div className="flex shrink-0 items-center justify-center gap-3 lg:justify-end">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
              aria-label="Facebook"
            >
              <Facebook
                aria-hidden
                className="size-[18px]"
                strokeWidth={1.75}
              />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
              aria-label="Twitter"
            >
              <Twitter
                aria-hidden
                className="size-[18px]"
                strokeWidth={1.75}
              />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
              aria-label="YouTube"
            >
              <Youtube
                aria-hidden
                className="size-[18px]"
                strokeWidth={1.75}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
